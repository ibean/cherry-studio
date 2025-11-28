# Change: Add Voice Input with Doubao ASR

## Why
Users want a convenient way to input text via voice. This feature enables users to record audio directly in the chat input, which is then transcribed using the Doubao ASR (Automatic Speech Recognition) API.

## What Changes
- **New Feature**: Voice input button in the chat input bar.
- **UI**:
  - Microphone icon next to the send button.
  - Waveform animation during recording.
  - Input box disabled during recording and processing.
- **Integration**:
  - Browser `MediaRecorder` for audio capture.
  - Doubao ASR API integration for transcription.
  - Automatic audio format conversion to match API requirements.
- **Settings**:
  - New configuration section for Doubao API credentials (App ID, Access Token).

## Impact
- **Affected Specs**: `voice-input` (new capability).
- **Affected Code**:
  - `src/renderer/src/pages/home/Inputbar/` (UI changes).
  - `src/renderer/src/store/settings.ts` (New settings).
  - `src/renderer/src/pages/settings/` (Settings UI).
  - `src/main/services/` (Potential new service for API proxy/conversion if needed).

