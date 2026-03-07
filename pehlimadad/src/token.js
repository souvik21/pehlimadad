'use strict';

const crypto = require('crypto');

const TOKEN_TTL_MINUTES = 15;
const SECRET = process.env.TWILIO_AUTH_TOKEN || 'pehlimadad-dev-secret';

/**
 * Generate a short-lived signed token encoding the phone number.
 * Token = base64url( phone + ':' + timeBucket ) where timeBucket changes every TTL_MINUTES.
 * Signed with HMAC-SHA256 to prevent forgery.
 *
 * Format: <payload_b64>.<sig_hex_8chars>
 */
function generateToken(phone) {
  const bucket = Math.floor(Date.now() / (TOKEN_TTL_MINUTES * 60 * 1000));
  const payload = Buffer.from(`${phone}:${bucket}`).toString('base64url');
  const sig = crypto
    .createHmac('sha256', SECRET)
    .update(payload)
    .digest('hex')
    .slice(0, 10);
  return `${payload}.${sig}`;
}

/**
 * Verify token and extract phone number.
 * Returns phone string or null if invalid/expired.
 * Accepts tokens from current and previous bucket (handles edge cases at boundary).
 */
function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payload, receivedSig] = parts;

  // Check current bucket and previous bucket (for tokens issued just before boundary)
  const now = Math.floor(Date.now() / (TOKEN_TTL_MINUTES * 60 * 1000));
  for (const bucket of [now, now - 1]) {
    try {
      const decoded = Buffer.from(payload, 'base64url').toString('utf8');
      const [phone, tokenBucket] = decoded.split(':');
      if (parseInt(tokenBucket, 10) !== bucket) continue;

      // Verify signature
      const expectedSig = crypto
        .createHmac('sha256', SECRET)
        .update(payload)
        .digest('hex')
        .slice(0, 10);

      if (crypto.timingSafeEqual(Buffer.from(receivedSig), Buffer.from(expectedSig))) {
        return phone;
      }
    } catch {
      // ignore decode errors
    }
  }

  return null;
}

module.exports = { generateToken, verifyToken };
