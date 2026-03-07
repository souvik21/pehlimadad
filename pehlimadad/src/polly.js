'use strict';

const { PollyClient, SynthesizeSpeechCommand } = require('@aws-sdk/client-polly');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const axios = require('axios');
const { LANG_CONFIG } = require('./lang');

const polly = new PollyClient({ region: process.env.AWS_REGION || 'us-east-1' });
const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
const BUCKET = process.env.S3_BUCKET || 'pehlimadad-audio-temp-dev';

// Best available voices for India
// Kajal = Hindi neural (natural, clear, best for emergencies)
// Aditi = Hindi standard (bilingual hi+en, fallback)
// Raveena = Indian English standard
const VOICES = {
  hi: { id: 'Kajal', engine: 'neural', languageCode: 'hi-IN' },
  en: { id: 'Raveena', engine: 'standard', languageCode: 'en-IN' },
};

/**
 * Strip markdown and symbols that sound bad when spoken aloud.
 * Polly reads "*bold*" as "asterisk bold asterisk" — not great.
 */
function cleanForSpeech(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')   // **bold**
    .replace(/\*(.*?)\*/g, '$1')        // *bold*
    .replace(/_(.*?)_/g, '$1')          // _italic_
    .replace(/`([^`]+)`/g, '$1')        // `code`
    .replace(/https?:\/\/\S+/g, '')     // URLs
    .replace(/─{2,}/g, '')              // horizontal rules
    // Strip all emoji (covers the full Unicode emoji ranges)
    .replace(/[\u{1F000}-\u{1FFFF}|\u{2600}-\u{27FF}|\u{2B00}-\u{2BFF}|\u{FE00}-\u{FEFF}|\u{1F900}-\u{1F9FF}|\u{231A}-\u{231B}|\u{23E9}-\u{23F3}|\u{25AA}-\u{25FE}|\u{2614}-\u{2615}|\u{2648}-\u{2653}|\u{26AA}-\u{26AB}|\u{2705}|\u{274C}|\u{274E}|\u{2753}-\u{2755}|\u{2795}-\u{2797}|\u{27B0}|\u{27BF}]/gu, '')
    .replace(/\n{3,}/g, '\n\n')         // collapse excess newlines
    .replace(/\*([A-Z ]+):\*/g, '$1:')  // *SECTION:* → SECTION:
    .trim();
}

/**
 * Convert text to speech using Amazon Polly and upload to S3.
 * Returns a pre-signed URL valid for 10 minutes (Twilio fetches within seconds).
 *
 * @param {string} text - Text to speak
 * @param {string} lang - 'hi' or 'en'
 * @param {string} keyPrefix - S3 key prefix (e.g. phone number)
 * @returns {Promise<string>} Pre-signed URL to MP3 audio
 */
async function textToSpeech(text, lang = 'hi', keyPrefix = 'tts') {
  const voice = VOICES[lang] || VOICES.hi;
  const speechText = cleanForSpeech(text);

  if (!speechText || speechText.length < 3) return null;

  // Polly has 3000 char limit for standard, 3000 for neural (non-SSML)
  const truncated = speechText.slice(0, 2800);

  // Synthesize speech
  const synthCommand = new SynthesizeSpeechCommand({
    Text: truncated,
    OutputFormat: 'mp3',
    VoiceId: voice.id,
    Engine: voice.engine,
    LanguageCode: voice.languageCode,
    TextType: 'text',
  });

  let audioStream;
  try {
    const result = await polly.send(synthCommand);
    audioStream = result.AudioStream;
  } catch (err) {
    // Kajal neural might not be available in all regions — fallback to Aditi standard
    if (lang === 'hi' && err.name !== 'TextLengthExceededException') {
      const fallbackCommand = new SynthesizeSpeechCommand({
        Text: truncated,
        OutputFormat: 'mp3',
        VoiceId: 'Aditi',
        Engine: 'standard',
        LanguageCode: 'hi-IN',
        TextType: 'text',
      });
      const fallbackResult = await polly.send(fallbackCommand);
      audioStream = fallbackResult.AudioStream;
    } else {
      throw err;
    }
  }

  // Collect stream into buffer
  const chunks = [];
  for await (const chunk of audioStream) {
    chunks.push(chunk);
  }
  const audioBuffer = Buffer.concat(chunks);

  // Upload to S3
  const safePrefix = keyPrefix.replace(/[^a-zA-Z0-9]/g, '');
  const key = `tts/${safePrefix}-${Date.now()}.mp3`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: audioBuffer,
      ContentType: 'audio/mpeg',
    })
  );

  // Generate pre-signed URL valid for 10 minutes
  // Twilio fetches it within seconds of message dispatch
  const signedUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: BUCKET, Key: key }),
    { expiresIn: 600 }
  );

  return signedUrl;
}

/**
 * Google Cloud TTS for non-Hindi/English Indian languages.
 * Returns a pre-signed S3 URL to the MP3.
 */
async function textToSpeechGoogle(text, lang, keyPrefix) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) throw new Error('No Google API key');

  const cfg = LANG_CONFIG[lang];
  if (!cfg || cfg.ttsProvider !== 'google') throw new Error(`No Google TTS config for lang: ${lang}`);

  const speechText = cleanForSpeech(text).slice(0, 4500); // Google limit: 5000 chars
  if (!speechText || speechText.length < 3) return null;

  const response = await axios.post(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
    {
      input: { text: speechText },
      voice: { languageCode: cfg.googleLang, name: cfg.googleVoice },
      audioConfig: { audioEncoding: 'MP3', speakingRate: 0.9 },
    },
    { timeout: 15000 }
  );

  const audioBuffer = Buffer.from(response.data.audioContent, 'base64');

  const safePrefix = keyPrefix.replace(/[^a-zA-Z0-9]/g, '');
  const key = `tts/${safePrefix}-${Date.now()}.mp3`;

  await s3.send(new PutObjectCommand({
    Bucket: BUCKET, Key: key, Body: audioBuffer, ContentType: 'audio/mpeg',
  }));

  return getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET, Key: key }), { expiresIn: 600 });
}

module.exports = { textToSpeech, textToSpeechGoogle };
