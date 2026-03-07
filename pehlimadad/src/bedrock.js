'use strict';

const { BedrockRuntimeClient, ConverseCommand } = require('@aws-sdk/client-bedrock-runtime');
const {
  INFO_GATHERING_PROMPT,
  FULL_ASSESSMENT_PROMPT,
  DOCTOR_SUMMARY_PROMPT,
  buildInfoGatheringMessages,
  buildFullAssessmentMessages,
  buildSummaryMessages,
} = require('./triage');

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

const MODEL_ID = process.env.BEDROCK_MODEL_ID || 'amazon.nova-pro-v1:0';

/**
 * Core invoke using Bedrock Converse API
 */
async function invoke(systemPrompt, messages, maxTokens = 512, temperature = 0.3) {
  const converseMessages = messages.map(m => ({
    role: m.role,
    content: [{ text: typeof m.content === 'string' ? m.content : JSON.stringify(m.content) }],
  }));

  const command = new ConverseCommand({
    modelId: MODEL_ID,
    system: [{ text: systemPrompt }],
    messages: converseMessages,
    inferenceConfig: { maxTokens, temperature, topP: 0.9 },
  });

  const response = await client.send(command);
  const text = response.output?.message?.content?.[0]?.text;
  if (!text) throw new Error('Empty response from Bedrock');
  return text.trim();
}

/**
 * Turn 1 — acknowledge emergency + ask for location/age/duration
 */
async function getInfoGatheringResponse(complaint) {
  const messages = buildInfoGatheringMessages(complaint);
  return invoke(INFO_GATHERING_PROMPT, messages, 200, 0.4);
}

/**
 * Turn 2 — full triage assessment with all sections
 */
async function getFullAssessment(complaint, detailsText) {
  const messages = buildFullAssessmentMessages(complaint, detailsText);
  return invoke(FULL_ASSESSMENT_PROMPT, messages, 700, 0.2);
}

/**
 * Doctor summary from conversation history
 */
async function getDoctorSummary(history) {
  const messages = buildSummaryMessages(history);
  return invoke(DOCTOR_SUMMARY_PROMPT, messages, 400, 0.1);
}

module.exports = { getInfoGatheringResponse, getFullAssessment, getDoctorSummary };
