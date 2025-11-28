## ADDED Requirements

### Requirement: Voice Recording Interaction
The system SHALL provide a mechanism for users to record voice input directly within the chat interface.

#### Scenario: Start Recording
- **WHEN** the user clicks the voice input icon in the chat input bar
- **THEN** the system MUST request microphone permissions if not already granted
- **AND** if granted, the system MUST start recording audio
- **AND** the input text area MUST be disabled
- **AND** the voice input icon MUST change to a waveform animation to indicate active recording
- **AND** the recording MUST automatically stop if it reaches the 5-minute limit

#### Scenario: Stop Recording and Transcribe
- **WHEN** the user clicks the voice input icon while recording is active
- **THEN** the system MUST stop recording
- **AND** the system MUST submit the audio to the Doubao ASR API
- **AND** the input text area MUST remain disabled during processing

#### Scenario: Permission Denied
- **WHEN** the user denies microphone permissions
- **THEN** the system MUST show a toast notification explaining the error
- **AND** the system MUST revert the icon to the default microphone state
- **AND** the input text area MUST be enabled

### Requirement: Voice Transcription (ASR)
The system SHALL use the Doubao ASR API to transcribe recorded audio into text.

#### Scenario: Successful Transcription
- **WHEN** the ASR API returns a successful text result
- **THEN** the system MUST append the recognized text to the current content of the input bar
- **AND** if the input bar was not empty, the system MUST insert a space separator before appending
- **AND** the input text area MUST be enabled
- **AND** the voice input icon MUST revert to the default state

#### Scenario: API Configuration
- **WHEN** the user navigates to Settings
- **THEN** the system MUST provide fields to configure the Doubao App ID and Access Token
- **AND** the system MUST securely store these credentials locally

#### Scenario: Error Handling
- **WHEN** an error occurs (network failure, API error, silence detected)
- **THEN** the system MUST show a descriptive toast notification
- **AND** the system MUST NOT automatically retry
- **AND** the input text area MUST be enabled
- **AND** the voice input icon MUST revert to the default state

