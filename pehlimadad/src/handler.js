'use strict';

const qs = require('qs');
const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda');
const { validateSignature } = require('./whatsapp');

const lambda = new LambdaClient({ region: process.env.AWS_REGION || 'us-east-1' });

/**
 * Webhook handler — responds to Twilio in <1s, fires processor async.
 * Twilio has a 15s webhook timeout. We must return before that.
 * All actual work (transcribe/bedrock/polly) happens in processor.js.
 */
async function webhook(event) {
  let body;
  try {
    // API Gateway HTTP API base64-encodes the body for binary-safe transport
    let rawBody = event.body || '';
    if (event.isBase64Encoded) {
      rawBody = Buffer.from(rawBody, 'base64').toString('utf8');
    }
    body = qs.parse(rawBody);
  } catch {
    return respond(400, 'Bad Request');
  }

  const signature = event.headers?.['x-twilio-signature'] || event.headers?.['X-Twilio-Signature'];
  const host = event.headers?.['host'] || event.headers?.['Host'] || '';
  if (!validateSignature(signature, `https://${host}/webhook`, body)) {
    console.warn('Invalid Twilio signature');
  }

  const from = body.From;
  if (!from) return respond(400, 'Missing From');

  // Fire the processor Lambda asynchronously (InvocationType: Event = fire-and-forget)
  const payload = {
    from,
    messageBody: (body.Body || '').trim(),
    numMedia: parseInt(body.NumMedia || '0', 10),
    mediaContentType: body.MediaContentType0 || '',
    mediaUrl: body.MediaUrl0 || '',
    latitude: body.Latitude || null,
    longitude: body.Longitude || null,
  };

  try {
    await lambda.send(new InvokeCommand({
      FunctionName: process.env.PROCESSOR_FUNCTION_NAME || 'pehlimadad-dev-processor',
      InvocationType: 'Event', // async — don't wait for response
      Payload: JSON.stringify(payload),
    }));
  } catch (err) {
    console.error('Failed to invoke processor:', err);
    // Still return 200 to Twilio — better to silently fail than confuse Twilio
  }

  // Return empty 200 immediately — Twilio is satisfied, processor runs in background
  return respond(200, '');
}

function respond(statusCode, message) {
  return { statusCode, headers: { 'Content-Type': 'text/plain' }, body: message };
}

module.exports = { webhook };
