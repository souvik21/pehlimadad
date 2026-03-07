# PehliMadad — AI Health Emergency Triage on WhatsApp

> India's first voice-first, bilingual AI health triage bot on real WhatsApp — powered by Amazon Bedrock.

Built for **AI for Bharat Hackathon 2026, Phase 2**.

---

## Quick Start

### Prerequisites
- Node.js 20+
- AWS account with Bedrock model access enabled (Claude 3.5 Sonnet)
- Twilio account with WhatsApp Sandbox
- Serverless Framework: `npm i -g serverless`

### Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Deploy to AWS
npx sls deploy

# Note the WebhookUrl from output, set it in Twilio console
```

### Enable Bedrock
1. AWS Console → Amazon Bedrock → Model access
2. Enable: `Anthropic Claude 3.5 Sonnet`

### Configure Twilio
1. Twilio Console → Messaging → Try it out → Send a WhatsApp message
2. Set webhook URL to: `<API_GATEWAY_URL>/webhook`
3. Join sandbox: send `join <your-sandbox-code>` to `+1 415 523 8886`

---

## Architecture

```
WhatsApp User
    │ voice / text
    ▼
Twilio WhatsApp Sandbox
    │ POST webhook
    ▼
Amazon API Gateway (HTTP)
    │
    ▼
AWS Lambda (Node.js 20, 60s timeout)
    ├─ Audio → S3 → Amazon Transcribe (hi-IN + en-US)
    ├─ DynamoDB — conversation context (24h TTL)
    ├─ Amazon Bedrock [claude-3-5-sonnet] → triage
    └─ Twilio API → WhatsApp response
```

## AWS Services
| Service | Usage |
|---|---|
| Amazon Bedrock | Claude 3.5 Sonnet — triage AI |
| Amazon Transcribe | Voice → text (Hindi + English) |
| AWS Lambda | Serverless backend |
| Amazon API Gateway | Twilio webhook endpoint |
| Amazon DynamoDB | Session state (24h TTL) |
| Amazon S3 | Temp audio storage (1 day lifecycle) |

---

## Test Scenarios

| Input | Expected Severity |
|---|---|
| "Mere baap ko seene mein dard hai" | 🔴 CRITICAL |
| "Child has 104 fever, not responding" | 🟠 URGENT |
| "Haath mein chhoti si cut hai" | 🟢 MILD |
| Hindi voice note about symptoms | Transcribed → triaged |

---

## Environment Variables

See `.env.example` for all required variables.

---

## Project Structure

```
pehlimadad/
├── src/
│   ├── handler.js      # Lambda entry point
│   ├── triage.js       # System prompt + message builder
│   ├── bedrock.js      # Bedrock client
│   ├── transcribe.js   # Voice → text pipeline
│   ├── session.js      # DynamoDB session CRUD
│   ├── whatsapp.js     # Twilio helpers
│   └── facilities.js   # Emergency contacts
├── web/
│   └── index.html      # Landing page
├── serverless.yml      # IaC
└── package.json
```

---

## Medical Disclaimer

PehliMadad provides first-aid guidance only. It does not diagnose medical conditions or prescribe treatments. Always call **108** for life-threatening emergencies.
