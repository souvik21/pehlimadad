'use strict';

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const {
  TranscribeClient,
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand,
} = require('@aws-sdk/client-transcribe');
const axios = require('axios');
const { getLangCode } = require('./lang');

const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
const transcribeClient = new TranscribeClient({ region: process.env.AWS_REGION || 'us-east-1' });

const BUCKET = process.env.S3_BUCKET || 'pehlimadad-audio-temp-dev';
const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 20; // 60 seconds max

/**
 * Download audio from Twilio MediaUrl (authenticated)
 */
async function downloadTwilioAudio(mediaUrl, accountSid, authToken) {
  const response = await axios.get(mediaUrl, {
    responseType: 'arraybuffer',
    auth: { username: accountSid, password: authToken },
    timeout: 15000,
  });
  return Buffer.from(response.data);
}

/**
 * Upload audio buffer to S3
 */
async function uploadToS3(audioBuffer, key, contentType = 'audio/ogg') {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: audioBuffer,
      ContentType: contentType,
    })
  );
  return `s3://${BUCKET}/${key}`;
}

/**
 * Poll Amazon Transcribe job until completion
 */
async function pollTranscribeJob(jobName) {
  for (let i = 0; i < MAX_POLLS; i++) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

    const result = await transcribeClient.send(
      new GetTranscriptionJobCommand({ TranscriptionJobName: jobName })
    );

    const status = result.TranscriptionJob.TranscriptionJobStatus;

    if (status === 'COMPLETED') {
      const transcriptUri = result.TranscriptionJob.Transcript.TranscriptFileUri;
      const transcriptResponse = await axios.get(transcriptUri, { timeout: 10000 });
      const transcriptData = transcriptResponse.data;
      const transcript = transcriptData.results.transcripts[0].transcript;
      const detectedTranscribeCode = transcriptData.results?.language_identification?.[0]?.code || null;
      const confidence = transcriptData.results?.language_identification?.[0]?.score || 'n/a';
      const lang = getLangCode(detectedTranscribeCode);
      console.log(`[STT] Transcribe done — lang: ${detectedTranscribeCode} → ${lang} (${confidence}), length: ${transcript.length}, text: "${transcript}"`);
      return { transcript: transcript || '', lang };
    }

    if (status === 'FAILED') {
      throw new Error(`Transcribe job failed: ${result.TranscriptionJob.FailureReason}`);
    }
    // QUEUED or IN_PROGRESS — keep polling
  }

  throw new Error('Transcribe job timed out after 30 seconds');
}

/*
 * Google Cloud Speech-to-Text — disabled, Amazon Transcribe is active.
 * Kept here as reference in case Transcribe subscription lapses.
 *
 * async function transcribeWithGoogle(audioBuffer) { ... }
 */

/**
 * Full pipeline: download audio → Amazon Transcribe (hi-IN + en-US bilingual)
 */
async function transcribeAudio(mediaUrl, phone) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  // 1. Download audio from Twilio
  const audioBuffer = await downloadTwilioAudio(mediaUrl, accountSid, authToken);

  // 2. Try Amazon Transcribe first (best quality, bilingual)
  try {
    const timestamp = Date.now();
    const safePhone = phone.replace(/[^a-zA-Z0-9]/g, '');
    const key = `audio/${safePhone}-${timestamp}.ogg`;
    const s3Uri = await uploadToS3(audioBuffer, key, 'audio/ogg');

    const jobName = `pm-${safePhone}-${timestamp}`;
    await transcribeClient.send(
      new StartTranscriptionJobCommand({
        TranscriptionJobName: jobName,
        Media: { MediaFileUri: s3Uri },
        MediaFormat: 'ogg',
        IdentifyLanguage: true,
        LanguageOptions: ['hi-IN', 'en-US', 'bn-IN', 'ta-IN', 'te-IN', 'mr-IN', 'gu-IN', 'kn-IN', 'ml-IN', 'pa-IN'],
        Settings: { ShowSpeakerLabels: false },
      })
    );

    return await pollTranscribeJob(jobName); // returns { transcript, lang }

  } catch (err) {
    throw err;
  }
}

module.exports = { transcribeAudio };
