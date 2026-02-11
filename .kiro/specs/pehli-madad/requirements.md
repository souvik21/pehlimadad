# Requirements Document: PehliMadad

## Introduction

PehliMadad (पहली मदद — "First Help") is a voice-first, WhatsApp-based AI health emergency triage system designed for rural India. It operates as the missing pre-hospital intelligence layer between "someone is sick" and "they reach a hospital." The system receives voice notes describing symptoms in any Indian language, performs medical triage, and responds with urgency classification, first-aid instructions, and facility routing—all via voice in the user's language.

## Glossary

- **Triage_System**: The AI-powered medical urgency classification engine
- **WhatsApp_Gateway**: The WhatsApp Business API integration layer
- **Transcription_Service**: Amazon Transcribe with auto language detection
- **Medical_Reasoning_Engine**: Amazon Bedrock (Claude) with RAG over WHO/ICMR protocols
- **Voice_Synthesis_Service**: Amazon Polly for text-to-speech in Indian languages
- **Facility_Locator**: Google Maps API integration for medical facility routing
- **Session_Manager**: DynamoDB-based conversation state management
- **Follow_Up_Scheduler**: EventBridge-based reminder system
- **Audio_Store**: S3 storage for voice notes and responses
- **Protocol_Database**: WHO/ICMR medical guidelines knowledge base
- **Urgency_Level**: Classification as RED (critical), YELLOW (urgent), or GREEN (non-urgent)
- **User**: Person sending health emergency query via WhatsApp
- **Medical_Facility**: Hospital, clinic, or health center in the facility database

## Requirements

### Requirement 1: Voice Message Reception

**User Story:** As a rural user with limited literacy, I want to send a voice note in my native language describing symptoms, so that I can get medical guidance without typing.

#### Acceptance Criteria

1. WHEN a User sends a voice note to the WhatsApp number, THE WhatsApp_Gateway SHALL receive and acknowledge the message within 2 seconds
2. WHEN a voice note is received, THE WhatsApp_Gateway SHALL store the audio file in Audio_Store with a unique identifier
3. WHEN a voice note exceeds 3 minutes duration, THE WhatsApp_Gateway SHALL accept it and process the full content
4. WHEN a User sends multiple voice notes in sequence, THE Session_Manager SHALL associate them with the same conversation session
5. IF a User sends a non-voice message (text, image, video), THEN THE WhatsApp_Gateway SHALL respond with a voice message requesting a voice note instead

### Requirement 2: Automatic Language Detection and Transcription

**User Story:** As a user speaking any Indian language, I want the system to understand my voice note automatically, so that I don't need to specify my language.

#### Acceptance Criteria

1. WHEN a voice note is received, THE Transcription_Service SHALL automatically detect the spoken language from the supported set (Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, English)
2. WHEN language detection completes, THE Transcription_Service SHALL transcribe the audio to text with the detected language code
3. WHEN transcription fails due to poor audio quality, THE Triage_System SHALL respond asking the User to resend with clearer audio
4. WHEN background noise is present, THE Transcription_Service SHALL attempt transcription and flag low confidence scores
5. WHEN transcription completes, THE Session_Manager SHALL store both the original audio reference and transcribed text

### Requirement 3: Medical Triage and Urgency Classification

**User Story:** As a user describing symptoms, I want the system to assess how urgent my situation is, so that I know whether to seek immediate care or can wait.

#### Acceptance Criteria

1. WHEN transcribed symptoms are received, THE Medical_Reasoning_Engine SHALL classify urgency as RED, YELLOW, or GREEN based on Protocol_Database guidelines
2. WHEN symptoms indicate life-threatening conditions (chest pain, difficulty breathing, severe bleeding, altered consciousness), THE Medical_Reasoning_Engine SHALL classify as RED
3. WHEN symptoms indicate urgent but not immediately life-threatening conditions, THE Medical_Reasoning_Engine SHALL classify as YELLOW
4. WHEN symptoms indicate non-urgent conditions, THE Medical_Reasoning_Engine SHALL classify as GREEN
5. WHEN symptom description is ambiguous or incomplete, THE Medical_Reasoning_Engine SHALL default to YELLOW classification and request additional information
6. WHEN classification is RED, THE Triage_System SHALL prioritize response generation and delivery within 10 seconds
7. THE Medical_Reasoning_Engine SHALL NOT provide medical diagnoses, only urgency classification and guidance

### Requirement 4: Protocol-Grounded First-Aid Instructions

**User Story:** As a user waiting for medical help, I want clear first-aid instructions based on medical protocols, so that I can help the patient safely while waiting.

#### Acceptance Criteria

1. WHEN urgency classification completes, THE Medical_Reasoning_Engine SHALL retrieve relevant first-aid instructions from Protocol_Database
2. THE Medical_Reasoning_Engine SHALL ground all first-aid instructions in WHO or ICMR protocols
3. THE Medical_Reasoning_Engine SHALL NOT recommend prescription medications
4. WHEN dangerous medical myths are detected in user input (e.g., applying ice to burns, tourniquets for snakebites), THE Medical_Reasoning_Engine SHALL explicitly counter them with correct protocol
5. THE Medical_Reasoning_Engine SHALL provide step-by-step instructions in simple, actionable language
6. WHEN first-aid instructions involve potential risks, THE Medical_Reasoning_Engine SHALL include safety warnings
7. THE Medical_Reasoning_Engine SHALL include explicit disclaimer that this is not medical diagnosis and professional care is needed

### Requirement 5: Medical Facility Routing

**User Story:** As a user needing medical care, I want to know the nearest appropriate facility, so that I can get there quickly.

#### Acceptance Criteria

1. WHEN urgency classification is RED or YELLOW, THE Facility_Locator SHALL identify the nearest appropriate Medical_Facility based on User location
2. WHEN User location is not available, THE Facility_Locator SHALL request location sharing via WhatsApp
3. WHEN multiple facilities are nearby, THE Facility_Locator SHALL prioritize based on facility type matching urgency level (RED → hospital with emergency, YELLOW → clinic or hospital, GREEN → primary health center)
4. WHEN facility information is retrieved, THE Triage_System SHALL include facility name, distance, and estimated travel time in response
5. WHEN no facilities are found within 50km, THE Triage_System SHALL provide the nearest facility regardless of distance and suggest calling emergency services
6. THE Facility_Locator SHALL provide directions compatible with Google Maps links for easy navigation

### Requirement 6: Voice Response Generation

**User Story:** As a user with limited literacy, I want to receive guidance as a voice message in my language, so that I can understand it without reading.

#### Acceptance Criteria

1. WHEN response content is prepared, THE Voice_Synthesis_Service SHALL convert text to speech in the same language as the input
2. WHEN the detected language is not supported by Voice_Synthesis_Service, THE Voice_Synthesis_Service SHALL default to Hindi and notify the User
3. THE Voice_Synthesis_Service SHALL use natural, clear pronunciation suitable for rural users
4. WHEN response audio is generated, THE Triage_System SHALL store it in Audio_Store
5. WHEN response audio exceeds WhatsApp's message size limit, THE Triage_System SHALL split into multiple sequential voice messages
6. THE WhatsApp_Gateway SHALL deliver the voice response to the User within 15 seconds of receiving the original voice note

### Requirement 7: End-to-End Response Time

**User Story:** As a user in a medical emergency, I want fast responses, so that I can act quickly to help the patient.

#### Acceptance Criteria

1. WHEN a voice note is received, THE Triage_System SHALL complete the full pipeline (transcription, triage, instruction generation, voice synthesis, delivery) within 15 seconds for 95% of requests
2. WHEN urgency is classified as RED, THE Triage_System SHALL prioritize processing and respond within 10 seconds
3. WHEN processing exceeds expected time, THE WhatsApp_Gateway SHALL send an interim "processing" message to the User
4. THE Triage_System SHALL process requests concurrently to handle multiple users simultaneously

### Requirement 8: Session Management and Follow-Up

**User Story:** As a user who has contacted the system, I want the system to remember our conversation and follow up, so that I receive continued support.

#### Acceptance Criteria

1. WHEN a User sends their first message, THE Session_Manager SHALL create a new session with unique identifier
2. WHEN a User sends subsequent messages within 24 hours, THE Session_Manager SHALL associate them with the existing session
3. WHEN a session is classified as RED or YELLOW, THE Follow_Up_Scheduler SHALL schedule a follow-up message after 2 hours
4. WHEN follow-up time arrives, THE Follow_Up_Scheduler SHALL send a voice message asking about the User's status
5. WHEN a User responds to follow-up, THE Session_Manager SHALL update the session with new information
6. WHEN a session has no activity for 48 hours, THE Session_Manager SHALL archive the session

### Requirement 9: Safety and Liability Protection

**User Story:** As the system operator, I want clear safety guardrails and disclaimers, so that users understand limitations and the system doesn't cause harm.

#### Acceptance Criteria

1. THE Medical_Reasoning_Engine SHALL NOT provide medical diagnoses under any circumstances
2. THE Medical_Reasoning_Engine SHALL NOT recommend prescription medications
3. WHEN generating any response, THE Triage_System SHALL include a disclaimer that this is not a substitute for professional medical care
4. WHEN urgency is RED, THE Triage_System SHALL explicitly instruct the User to call emergency services (108 in India) immediately
5. THE Medical_Reasoning_Engine SHALL err on the side of caution when classifying ambiguous symptoms (prefer higher urgency)
6. WHEN User describes symptoms that could indicate multiple conditions, THE Medical_Reasoning_Engine SHALL address the most serious possibility first
7. THE Triage_System SHALL log all interactions for audit and quality review purposes

### Requirement 10: Supported Medical Scenarios

**User Story:** As a rural user facing common health emergencies, I want the system to handle scenarios relevant to my context, so that I get appropriate guidance.

#### Acceptance Criteria

1. THE Protocol_Database SHALL include protocols for high fever with rashes (dengue, measles)
2. THE Protocol_Database SHALL include protocols for snakebites with species-specific guidance where possible
3. THE Protocol_Database SHALL include protocols for chest pain and cardiac symptoms
4. THE Protocol_Database SHALL include protocols for pregnancy complications (bleeding, severe pain, reduced fetal movement)
5. THE Protocol_Database SHALL include protocols for child respiratory distress
6. THE Protocol_Database SHALL include protocols for burns (thermal, chemical, electrical)
7. THE Protocol_Database SHALL include protocols for animal bites (dog, cat, monkey)
8. THE Protocol_Database SHALL include protocols for severe diarrhea and vomiting (dehydration assessment)
9. THE Protocol_Database SHALL include protocols for agricultural injuries (machinery, pesticide exposure)
10. WHEN a scenario is not covered in Protocol_Database, THE Medical_Reasoning_Engine SHALL provide general emergency guidance and recommend immediate medical consultation

### Requirement 11: Audio Quality and Storage

**User Story:** As a system operator, I want reliable audio handling and storage, so that we can process messages accurately and maintain records.

#### Acceptance Criteria

1. WHEN a voice note is received, THE Audio_Store SHALL store the original audio file with metadata (timestamp, user identifier, session ID)
2. WHEN a voice response is generated, THE Audio_Store SHALL store the synthesized audio with reference to the original query
3. THE Audio_Store SHALL retain audio files for 90 days for quality review and audit purposes
4. WHEN storage quota is reached, THE Audio_Store SHALL archive oldest files to cold storage
5. THE Audio_Store SHALL encrypt all audio files at rest
6. WHEN audio files are accessed for review, THE Audio_Store SHALL log access with user and timestamp

### Requirement 12: Error Handling and Graceful Degradation

**User Story:** As a user experiencing technical issues, I want the system to handle errors gracefully and guide me, so that I can still get help.

#### Acceptance Criteria

1. WHEN Transcription_Service fails, THE Triage_System SHALL respond asking the User to resend the voice note
2. WHEN Medical_Reasoning_Engine is unavailable, THE Triage_System SHALL provide a fallback message with emergency contact numbers
3. WHEN Voice_Synthesis_Service fails, THE Triage_System SHALL send response as text message with apology
4. WHEN Facility_Locator fails, THE Triage_System SHALL provide general guidance to seek nearest hospital
5. WHEN WhatsApp_Gateway connection is lost, THE Triage_System SHALL queue messages for delivery when connection restores
6. WHEN any component fails, THE Triage_System SHALL log detailed error information for debugging
7. THE Triage_System SHALL monitor component health and alert operators when failure rates exceed 5%

### Requirement 13: Multi-Language Voice Quality

**User Story:** As a user speaking a regional language, I want voice responses that sound natural and clear, so that I can understand instructions easily.

#### Acceptance Criteria

1. THE Voice_Synthesis_Service SHALL support natural-sounding voices for Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, and English
2. WHEN generating voice responses, THE Voice_Synthesis_Service SHALL use appropriate speaking rate for medical instructions (slower than conversational)
3. THE Voice_Synthesis_Service SHALL pronounce medical terms correctly in each language
4. WHEN technical medical terms have no common translation, THE Voice_Synthesis_Service SHALL use simple explanatory phrases instead
5. THE Triage_System SHALL validate voice output quality through periodic human review

### Requirement 14: Privacy and Data Protection

**User Story:** As a user sharing sensitive health information, I want my data protected, so that my privacy is maintained.

#### Acceptance Criteria

1. THE Triage_System SHALL NOT store personally identifiable information beyond what is necessary for session management
2. THE Session_Manager SHALL use anonymized identifiers for users (not phone numbers in logs)
3. WHEN storing transcriptions, THE Triage_System SHALL redact names, addresses, and other PII
4. THE Triage_System SHALL encrypt all data in transit using TLS 1.3 or higher
5. THE Triage_System SHALL encrypt all data at rest using AES-256
6. WHEN a User requests data deletion, THE Triage_System SHALL remove all associated data within 7 days
7. THE Triage_System SHALL comply with Indian data protection regulations (Digital Personal Data Protection Act)

### Requirement 15: System Monitoring and Quality Assurance

**User Story:** As a system operator, I want comprehensive monitoring and quality metrics, so that I can ensure the system is performing well and helping users effectively.

#### Acceptance Criteria

1. THE Triage_System SHALL log response time for each pipeline stage (transcription, triage, synthesis, delivery)
2. THE Triage_System SHALL track urgency classification distribution (RED/YELLOW/GREEN percentages)
3. THE Triage_System SHALL monitor transcription accuracy through confidence scores
4. THE Triage_System SHALL track language detection accuracy and distribution
5. THE Triage_System SHALL alert operators when end-to-end response time exceeds 20 seconds for more than 10% of requests
6. THE Triage_System SHALL provide daily summary reports of usage, errors, and performance metrics
7. THE Triage_System SHALL enable random sampling of interactions for medical quality review by healthcare professionals
