## Context
The user requires a voice input feature using the Doubao ASR API. The flow involves recording audio in the browser, sending it to the API, and inserting the transcribed text into the chat input.

## Goals
- seamless voice-to-text experience.
- Reliable audio recording and upload.
- Secure management of API credentials (stored locally).
- Robust error handling (no retries, clear user feedback).

## Decisions
- **Architecture**:
  - **Recording**: Browser-side `MediaRecorder` API. Modern browsers support `audio/webm; codecs=opus` which Doubao API supports (OGG OPUS). We will attempt to send the recorded Blob directly or convert to base64 as required by the JSON API.
  - **API Call**:
    - **Option A**: Call from Main Process. Better for CORS and secret management (though secrets are user-provided).
    - **Option B**: Call from Renderer. Simpler if no CORS issues.
    - **Decision**: **Call from Main Process** (`VoiceService` or similar). This avoids CORS issues often encountered with 3rd party APIs in Renderer and allows for more robust file handling/conversion if `ffmpeg` is needed later.
- **State Management**: Use a local React state or a small slice in Redux store for "isRecording" / "isProcessing" to coordinate the Inputbar disabled state.
- **Audio Format**:
  - Browser records `audio/webm` or `audio/ogg`.
  - Doubao supports `OGG OPUS`.
  - We will verify if the browser output is directly compatible. If not, we might need a lightweight conversion (e.g., `audio-buffer-utils` or sending to Main for `ffmpeg`). *Assumption*: Browser `audio/webm` is accepted or easily convertible.

## Risks
- **Audio Format Compatibility**: Browser implementation of `MediaRecorder` varies. Chrome/Electron usually produces `audio/webm`. Doubao docs say "OGG OPUS". WebM is a container that often uses Opus. We need to ensure the API accepts it or repackage it.
- **Microphone Permissions**: Electron requires handling permission requests. We need to ensure the main process handles the permission check/request correctly.

## Migration Plan
- N/A (New feature).

