import { useCallback, useRef, useState } from 'react'

export interface VoiceRecorderHook {
  isRecording: boolean
  startRecording: () => Promise<void>
  stopRecording: () => Promise<Blob>
  audioLevel: number
}

export const useVoiceRecorder = (): VoiceRecorderHook => {
  const [isRecording, setIsRecording] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const updateAudioLevel = useCallback(() => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
      analyserRef.current.getByteFrequencyData(dataArray)

      // Calculate average volume
      let sum = 0
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i]
      }
      const average = sum / dataArray.length
      setAudioLevel(average)
    }
    animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
  }, [])

  const startRecording = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    streamRef.current = stream

    // Setup MediaRecorder
    // Try to use webm/opus or default
    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm'

    mediaRecorderRef.current = new MediaRecorder(stream, { mimeType })
    chunksRef.current = []

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data)
      }
    }

    mediaRecorderRef.current.start(100) // Request data every 100ms

    // Setup Audio Analysis
    const audioContext = new AudioContext()
    audioContextRef.current = audioContext
    const source = audioContext.createMediaStreamSource(stream)
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 256
    source.connect(analyser)
    analyserRef.current = analyser

    setIsRecording(true)
    updateAudioLevel()
  }, [updateAudioLevel])

  const stopRecording = useCallback((): Promise<Blob> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) {
        resolve(new Blob()) // Should probably reject or return empty
        return
      }

      // Cleanup animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      setAudioLevel(0)

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mediaRecorderRef.current?.mimeType || 'audio/webm' })
        chunksRef.current = []
        setIsRecording(false)

        // Stop all tracks
        streamRef.current?.getTracks().forEach((track) => track.stop())
        streamRef.current = null

        // Close AudioContext
        audioContextRef.current?.close()
        audioContextRef.current = null
        analyserRef.current = null

        resolve(blob)
      }

      mediaRecorderRef.current.stop()
    })
  }, [])

  return { isRecording, startRecording, stopRecording, audioLevel }
}
