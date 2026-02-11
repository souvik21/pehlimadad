# 🏥 PehliMadad — India's First AI Health Emergency Triage on WhatsApp

> **"India has 1 doctor per 1,511 people in rural areas. PehliMadad is the triage nurse that every village is missing."**

![Hackathon Badge](https://img.shields.io/badge/Submission-AWS_AI_for_Bharat_2026-orange?style=for-the-badge) ![Status](https://img.shields.io/badge/Status-Prototype-green?style=for-the-badge) ![Tech](https://img.shields.io/badge/Tech-AWS_Bedrock_%7C_Transcribe_%7C_Polly-blue?style=for-the-badge)

---

## 🚨 The Problem: The "Golden Hour" is Lost

In rural India, the critical gap is not just the lack of hospitals—it's the lack of **intelligence** before reaching one.
*   **45%** of the time, no doctor is available at rural Primary Health Centers (PHCs).
*   **700 Million** Indians have no one to ask: *"Is this serious? What do I do right now? Where should I go?"*
*   **Result:** 50,000+ snakebite deaths/year and countless others due to delayed decision-making.

## 💡 The Solution: PehliMadad

**PehliMadad** (First Help) is a voice-first, WhatsApp-based AI triage system. It acts as the **missing pre-hospital intelligence layer**.

### The "Zero-Friction" User Experience
1.  **Speak Naturally:** User sends a WhatsApp voice note in **ANY** Indian language (Hindi, Tamil, Bengali, etc.).
2.  **Auto-Detection:** The AI automatically identifies the language and the medical urgency.
3.  **Instant Triage:** It responds (in Voice) with:
    *   **Urgency Level** (Red/Yellow/Green)
    *   **First Aid Instructions** (WHO Protocols)
    *   **Nearest Capable Facility** (e.g., "Hospital with Antivenom," not just the closest building)

#### User Journey Flow
```text
[ USER (Rural Bihar) ]       [ PEHLI MADAD AI BRAIN ]         [ ACTIONABLE OUTPUT ]
          │                             │                           │
          │ (1) Voice Note              │                           │
          ├──────────────────────────▶  │                           │
          │ "Mere bacche ko bukhar hai" │ (2) AI PROCESSING         │
          │ (Mixed Hindi/English)       │ - Detects: Hindi (hi-IN)  │
          │                             │ - Triage: RED (Urgent)    │
          │                             │ - Search: Blood Testing   │
          │                             │                           │
          │                             │ (3) Voice Response        │
          │                             │◀──────────────────────────┤
          │                             │ + Hospital Map & Summary  │
          │                             │                           │
          ▼                             ▼                           ▼
```

---

## 🏗️ Architecture & Tech Stack

PehliMadad uses a **Serverless, Event-Driven Architecture** on AWS to ensure scalability and zero idle costs.

### High-Level Flow
`WhatsApp Voice Note` → `AWS Lambda` → `Amazon Transcribe` → `Amazon Bedrock (Claude 3.5)` → `Amazon Polly` → `WhatsApp Voice Response`

### Enterprise Architecture
```text
      ┌────────────────────────────────────────────────────────┐
      │             INTERFACE: WhatsApp Business API           │
      └──────────────────────────┬─────────────────────────────┘
                                 │ (Webhook)
                 ┌───────────────▼───────────────┐
                 │    ORCHESTRATOR: AWS Lambda   │
                 └───────────────┬───────────────┘
          ┌──────────────────────┴──────────────────────┐
          │                                             │
  ┌───────▼───────┐      ┌─────────────────────┐      ┌─▼─────────────┐
  │ VOICE ENGINE  │      │      AI BRAIN       │      │  DATA LAYER   │
  │ Amazon        │      │ Amazon Bedrock      │      │ DynamoDB      │
  │ Transcribe    │      │ (Claude 3.5 Sonnet) │      │ Amazon S3     │
  │ Amazon Polly  │      │                     │      │ (Voice Logs)  │
  └───────────────┘      └──────────┬──────────┘      └───────────────┘
                                    │ (RAG + Guardrails)
                         ┌──────────▼──────────┐
                         │ SAFETY: Guardrails  │
                         │ KNOWLEDGE: WHO/ICMR │
                         └─────────────────────┘
```

### Key AWS Services
*   **🧠 Brain:** Amazon Bedrock (Claude 3.5 Sonnet) for medical reasoning.
*   **🛡️ Safety:** Amazon Bedrock Guardrails + Knowledge Bases (RAG over WHO/ICMR protocols).
*   **👂 Ears:** Amazon Transcribe (Automatic Language Identification).
*   **🗣️ Mouth:** Amazon Polly (Neural TTS in Indian languages).
*   **⚡ Compute:** AWS Lambda (Serverless Orchestration).
*   **💾 Data:** Amazon DynamoDB (Session State) & S3 (Audio Logs).

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **🗣️ Auto-Language ID** | No menus. No "Press 1 for Hindi". Just speak. Supports Hinglish & code-switching. |
| **🚦 AI Triage Engine** | Classifies cases as **RED** (Critical), **YELLOW** (Urgent), or **GREEN** (Home Care). |
| **🩹 Protocol First Aid** | Evidence-based instructions (e.g., "Do not tie a tourniquet") grounded in WHO guidelines. |
| **🏥 Smart Routing** | Finds the nearest hospital *capable* of handling the specific emergency (Antivenom, Blood Bank, etc.). |
| **📋 Doctor Handoff** | Generates a structured clinical summary (text) for the treating physician. |

---

## 🛡️ Medical Safety & Ethics

**"Triage, Don't Diagnose."**
PehliMadad is designed with a "Double-Lock" safety system:
1.  **RAG Grounding:** The LLM is restricted to answer *only* using context from loaded WHO/ICMR documents.
2.  **Bedrock Guardrails:** Hard-coded content filters block the generation of prescription advice or definitive diagnoses.
3.  **Conservative Bias:** The system is tuned to "over-triage" (escalate ambiguity to Red/Yellow) to prevent missed emergencies.

---

## 📊 Impact Potential

*   **Target Audience:** 700 Million Rural Indians.
*   **Cost Efficiency:** ~₹1.20 ($0.014) per interaction approx (Serverless).
*   **Goal:** Reduce the "Time to Care" during the Golden Hour.

---

*Submitted for the AWS AI for Bharat Hackathon 2026.*