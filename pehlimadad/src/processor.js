'use strict';

/**
 * Async message processor — invoked by handler.js via Lambda async invoke.
 *
 * Two-turn flow:
 *   Turn 1 (stage: new)           → receive emergency → ask for location/age/duration
 *   Turn 2 (stage: gathering_info) → receive details → full assessment + doctor summary + facilities
 */

const { getInfoGatheringResponse, getFullAssessment, getDoctorSummary } = require('./bedrock');
const { getSession, saveSession, resetConversation } = require('./session');
const { transcribeAudio } = require('./transcribe');
const { sendResponse, sendMessage } = require('./whatsapp');
const { textToSpeech, textToSpeechGoogle } = require('./polly');
const { geocodePlace, findNearbyHealthFacilities } = require('./geocode');
const {
  parseAssessment,
  stripAssessmentBlock,
  buildFacilitiesMessage,
  getFallbackFacilitiesMessage,
  getWelcomeMessage,
} = require('./triage');
const { getEmergencyFooter } = require('./facilities');
const { detectLang, getLangCode, t, LANG_CONFIG } = require('./lang');

async function speak(to, text, lang, keyPrefix) {
  let audioUrl = null;
  try {
    const cfg = LANG_CONFIG[lang];
    if (cfg?.ttsProvider === 'google') {
      audioUrl = await textToSpeechGoogle(text, lang, keyPrefix);
    } else {
      audioUrl = await textToSpeech(text, lang, keyPrefix);
    }
  } catch (err) {
    console.warn(`TTS failed (${lang}), text-only:`, err.message);
  }
  await sendResponse(to, text, audioUrl);
}

async function process(event) {
  const { from, messageBody, numMedia, mediaContentType, mediaUrl, latitude, longitude } = event;
  const phone = from;

  console.log(`[PROCESSOR][${phone}] start stage=${event.stage || '?'}`);

  const session = await getSession(phone);

  // ── RESET ──────────────────────────────────────────────────────────────────
  if (messageBody && (messageBody.toLowerCase() === 'reset' || messageBody === 'नया')) {
    await resetConversation(phone);
    await speak(phone, getWelcomeMessage(), 'hi', phone);
    return;
  }

  // ── TRANSCRIBE VOICE ────────────────────────────────────────────────────────
  let userText = messageBody ? messageBody.trim() : '';
  let transcriptNote = '';
  let voiceLang = null; // lang detected by Transcribe

  if (numMedia > 0 && mediaContentType && mediaContentType.startsWith('audio/')) {
    console.log(`[PROCESSOR][${phone}] audio received — contentType: ${mediaContentType}`);
    try {
      const result = await transcribeAudio(mediaUrl, phone);
      userText = result.transcript;
      voiceLang = result.lang; // Transcribe-detected lang code
      console.log(`[PROCESSOR][${phone}] transcript: "${userText}" (lang: ${voiceLang})`);
      if (!userText || userText.length < 2) {
        const errLang = voiceLang || (session.complaint ? detectLang(session.complaint) : 'hi');
        await speak(phone, t('audioUnclear', errLang), errLang, phone);
        return;
      }
      transcriptNote = `🎤 "${userText}"\n\n`;
    } catch (err) {
      console.error(`[PROCESSOR][${phone}] transcribe error:`, err);
      const errLang = session.complaint ? detectLang(session.complaint) : 'hi';
      await speak(phone, t('audioError', errLang), errLang, phone);
      return;
    }
  }

  // Determine language: Transcribe result > text detection > session complaint
  const lang = voiceLang || detectLang(userText) || detectLang(session.complaint || '') || 'hi';

  const hasLocation = latitude && longitude;
  const hasText = userText && userText.length > 2;

  // ── STAGE: gathering_info ───────────────────────────────────────────────────
  if (session.stage === 'gathering_info') {
    const sessionLang = voiceLang || detectLang(session.complaint || '') || 'hi';

    if (hasLocation) {
      const coords = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
      if (hasText) {
        await runFullAssessment(phone, session, userText, coords, transcriptNote, voiceLang);
      } else {
        await saveSession(phone, { ...session, locationCoords: coords });
        await speak(phone, t('locationReceived', sessionLang), sessionLang, phone);
      }
      return;
    }

    if (session.locationCoords && hasText) {
      await runFullAssessment(phone, session, userText, session.locationCoords, transcriptNote, voiceLang);
      return;
    }

    if (hasText) {
      await runFullAssessment(phone, session, userText, null, transcriptNote, voiceLang);
      return;
    }

    // Nothing useful — prompt again
    await speak(phone, t('reminder', sessionLang), sessionLang, phone);
    return;
  }

  // ── STAGE: new / assessed — treat as fresh emergency ───────────────────────

  if (!hasText && !hasLocation) {
    await speak(phone, getWelcomeMessage(), 'hi', phone);
    return;
  }

  if (hasLocation && !hasText) {
    await speak(phone, t('locationAsk', lang), lang, phone);
    await saveSession(phone, { ...session, locationCoords: { lat: parseFloat(latitude), lng: parseFloat(longitude) } });
    return;
  }

  // ── TURN 1: New emergency — acknowledge + ask for details ──────────────────
  let infoRequest;
  try {
    infoRequest = await getInfoGatheringResponse(userText);
  } catch (err) {
    console.error(`[PROCESSOR][${phone}] bedrock error (turn1):`, err);
    await speak(phone, t('serviceUnavailable', lang), lang, phone);
    return;
  }

  await saveSession(phone, {
    stage: 'gathering_info',
    complaint: userText,
    locationCoords: null, // fresh session — don't carry over coords from previous emergency
    history: [
      { role: 'user', content: userText },
      { role: 'assistant', content: infoRequest },
    ],
    messageCount: 1,
    severity: null,
    facility: null,
  });

  await speak(phone, transcriptNote + infoRequest, lang, phone);
}

// ── Full assessment (Turn 2) ──────────────────────────────────────────────────

async function runFullAssessment(phone, session, detailsText, coords, transcriptNote, voiceLang) {
  const complaint = session.complaint || detailsText;
  const lang = voiceLang || detectLang(complaint) || 'hi';

  console.log(`[PROCESSOR][${phone}] running full assessment (lang: ${lang})`);

  let rawResponse;
  try {
    rawResponse = await getFullAssessment(complaint, detailsText);
  } catch (err) {
    console.error(`[PROCESSOR][${phone}] bedrock error (turn2):`, err);
    await speak(phone, t('serviceUnavailable', lang), lang, phone);
    return;
  }

  const assessment = parseAssessment(rawResponse);
  const cleanResponse = stripAssessmentBlock(rawResponse);
  if (!assessment) {
    console.warn(`[PROCESSOR][${phone}] parseAssessment failed — rawResponse head:`, rawResponse.slice(0, 300));
  }
  console.log(`[PROCESSOR][${phone}] assessment:`, JSON.stringify(assessment));

  // locationQuery from assessment; fall back to detailsText so we always have something for facilities
  const locationQuery = assessment?.locationQuery || detailsText;

  let resolvedCoords = coords;
  if (!resolvedCoords && assessment?.locationQuery) {
    resolvedCoords = await geocodePlace(assessment.locationQuery);
    console.log(`[PROCESSOR][${phone}] geocoded "${assessment.locationQuery}":`, resolvedCoords);
  } else if (!resolvedCoords) {
    console.log(`[PROCESSOR][${phone}] no coords — assessment.locationQuery:`, assessment?.locationQuery);
  }

  const isWestBengal = lang === 'bn' && /west bengal/i.test(locationQuery || '');
  const fullMessage = transcriptNote + cleanResponse + '\n\n' + getEmergencyFooter(lang, isWestBengal);

  const newHistory = [
    ...(session.history || []),
    { role: 'user', content: `Details: ${detailsText}${coords ? ` [GPS: ${coords.lat},${coords.lng}]` : ''}` },
    { role: 'assistant', content: cleanResponse },
  ];

  await saveSession(phone, {
    stage: 'assessed',
    complaint,
    locationCoords: resolvedCoords || null,
    history: newHistory,
    messageCount: (session.messageCount || 0) + 1,
    severity: assessment?.severity || null,
    facility: assessment?.facilityPrimary || null,
  });

  // Generate TTS audio in parallel while we send the text message
  const cfg = LANG_CONFIG[lang];
  const ttsPromise = (cfg?.ttsProvider === 'google'
    ? textToSpeechGoogle(fullMessage, lang, phone)
    : textToSpeech(fullMessage, lang, phone)
  ).catch((err) => { console.warn(`TTS failed (${lang}):`, err.message); return null; });

  // 1. Text triage message (no audio yet)
  await sendMessage(phone, fullMessage);

  // 2. Doctor summary
  await new Promise((r) => setTimeout(r, 1200));
  await sendDoctorSummaryMessage(phone, newHistory, lang);

  // 3. Nearby facilities
  await new Promise((r) => setTimeout(r, 800));
  await sendFacilitiesMessage(phone, resolvedCoords, locationQuery, lang);

  // 4. Voice note last
  const audioUrl = await ttsPromise;
  if (audioUrl) {
    await new Promise((r) => setTimeout(r, 500));
    await sendMessage(phone, '', audioUrl);
  }

  // Reset session after turn 2 is complete so the next message starts fresh
  await resetConversation(phone);
}

async function sendFacilitiesMessage(phone, coords, locationQuery, lang = 'hi') {
  try {
    let msg;
    if (coords) {
      const facilities = await findNearbyHealthFacilities(coords.lat, coords.lng);
      msg = buildFacilitiesMessage(facilities, lang);
    }
    if (!msg) msg = getFallbackFacilitiesMessage(locationQuery, lang);
    if (msg) await sendMessage(phone, msg);
  } catch (err) {
    console.error('Facilities message error:', err.message);
  }
}

async function sendDoctorSummaryMessage(phone, history, lang = 'hi') {
  if (!history || history.length < 2) return;
  try {
    const summary = await getDoctorSummary(history);
    await sendMessage(phone, t('doctorInstruction', lang) + '\n\n' + summary);
  } catch (err) {
    console.error('Doctor summary error:', err.message);
  }
}

module.exports = { process };
