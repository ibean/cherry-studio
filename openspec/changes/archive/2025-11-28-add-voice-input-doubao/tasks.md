## 1. Settings & Store
- [x] 1.1 Add `doubaoAsr` configuration (appId, accessToken) to `SettingsState` in `src/renderer/src/store/settings.ts`.
- [x] 1.2 Add UI for Doubao ASR settings in `src/renderer/src/pages/settings/` (likely a new section or under 'General'/'Model').

## 2. Core Logic (Main/Renderer)
- [x] 2.1 Implement audio recording utility in Renderer (using `MediaRecorder`).
- [x] 2.2 Implement audio format conversion (if browser native format not supported by Doubao) - *Note: Doubao supports Opus/WebM, which modern browsers produce, but we need to ensure compatibility or convert to WAV/PCM if needed.*
- [x] 2.3 Implement Doubao ASR API client (handling authentication, file upload/data sending, response parsing).
- [x] 2.4 Handle API error codes (20000003 silence, 55000031 busy, etc.) as per requirements.

## 3. UI Implementation
- [x] 3.1 Create `VoiceRecordButton` component.
  - [x] Default state: Microphone icon.
  - [x] Recording state: Waveform animation.
- [x] 3.2 Update `Inputbar` to include `VoiceRecordButton` next to `SendMessageButton`.
- [x] 3.3 Implement `VoiceInputManager` (hook or store) to manage recording state (idle, recording, processing).
- [x] 3.4 Bind Inputbar disabled state to the recording manager.
- [x] 3.5 Implement text appending logic (handle existing text, add space separator).

## 4. Testing & Validation
- [x] 4.1 Verify recording starts/stops correctly.
- [x] 4.2 Verify API credentials are saved and used.
- [x] 4.3 Verify text is appended correctly.
- [x] 4.4 Verify error toasts appear for permission denied or API errors.
