'use strict';

const twilio = require('twilio');

/**
 * Send a WhatsApp message — text only, or with audio as voice note.
 *
 * @param {string} to - Recipient e.g. "whatsapp:+919876543210"
 * @param {string} body - Text message body
 * @param {string|null} audioUrl - Pre-signed S3 URL to MP3 (sends as voice note)
 */
async function sendMessage(to, body, audioUrl = null) {
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  const from = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

  if (audioUrl) {
    // Send voice note (audio) — Twilio delivers as a playable audio message on WhatsApp
    await client.messages.create({
      from,
      to,
      mediaUrl: [audioUrl],
      // Optional caption shown below the audio player
      body: body || '',
    });
  } else {
    await client.messages.create({ from, to, body });
  }
}

/**
 * Send text + voice note as two separate messages when audioUrl is provided.
 * We send audio first (user hears it immediately), then text (for reference).
 *
 * In practice many rural users will have audio autoplay — text is a backup.
 */
async function sendResponse(to, textBody, audioUrl = null) {
  if (audioUrl) {
    // Audio message first
    await sendMessage(to, '', audioUrl);
    // Text right after (small delay to preserve order)
    await new Promise((r) => setTimeout(r, 300));
    await sendMessage(to, textBody);
  } else {
    await sendMessage(to, textBody);
  }
}

/**
 * Validate Twilio webhook signature
 */
function validateSignature(signature, url, params) {
  if (process.env.SKIP_TWILIO_VALIDATION === 'true') return true;
  if (!signature || !url) return false;

  return twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN,
    signature,
    url,
    params
  );
}

module.exports = { sendMessage, sendResponse, validateSignature };
