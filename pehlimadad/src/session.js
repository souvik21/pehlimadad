'use strict';

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

const dynamodb = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' })
);

const TABLE_NAME = process.env.DYNAMODB_TABLE || 'pehlimadad-sessions';
const TTL_HOURS = 24;
const MAX_HISTORY = 12;

/**
 * Session schema (per emergency — resets each time):
 * {
 *   phone: string,
 *   stage: 'new' | 'gathering_info' | 'assessed',
 *   complaint: string | null,           // Turn 1: original emergency description
 *   locationCoords: {lat, lng} | null,  // WhatsApp location share coords (if received)
 *   history: [{role, content}],         // full conversation for doctor summary
 *   messageCount: number,
 *   severity: string | null,
 *   facility: string | null,
 *   ttl: number,
 *   updatedAt: string
 * }
 */

async function getSession(phone) {
  try {
    const result = await dynamodb.send(
      new GetCommand({ TableName: TABLE_NAME, Key: { phone } })
    );

    if (!result.Item) return defaultSession();

    if (result.Item.ttl && result.Item.ttl < Math.floor(Date.now() / 1000)) {
      return defaultSession();
    }

    return {
      history: result.Item.history || [],
      messageCount: result.Item.messageCount || 0,
      stage: result.Item.stage || 'new',
      complaint: result.Item.complaint || null,
      locationCoords: result.Item.locationCoords || null,
      severity: result.Item.severity || null,
      facility: result.Item.facility || null,
    };
  } catch (err) {
    console.error('DynamoDB getSession error:', err);
    return defaultSession();
  }
}

function defaultSession() {
  return {
    history: [],
    messageCount: 0,
    stage: 'new',
    complaint: null,
    locationCoords: null,
    severity: null,
    facility: null,
  };
}

async function saveSession(phone, updates) {
  const ttl = Math.floor(Date.now() / 1000) + TTL_HOURS * 3600;
  const item = {
    phone,
    ttl,
    updatedAt: new Date().toISOString(),
    ...updates,
    history: (updates.history || []).slice(-MAX_HISTORY),
  };
  try {
    await dynamodb.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
  } catch (err) {
    console.error('DynamoDB saveSession error:', err);
  }
}

/**
 * Reset to fresh new emergency (wipes everything)
 */
async function resetConversation(phone) {
  await saveSession(phone, defaultSession());
}

module.exports = { getSession, saveSession, resetConversation, defaultSession };
