import { useSettings } from '@renderer/hooks/useSettings'
import { useVoiceRecorder } from '@renderer/hooks/useVoiceRecorder'
import { IpcChannel } from '@shared/IpcChannel'
import { Button, Tooltip } from 'antd'
import { Loader2, Mic, Square } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
// import { useTranslation } from 'react-i18next'

interface VoiceInputButtonProps {
  onTranscribe: (text: string) => void
  disabled?: boolean
  onRecordingStateChange: (isRecording: boolean) => void
}

export const VoiceInputButton = ({ onTranscribe, disabled, onRecordingStateChange }: VoiceInputButtonProps) => {
  const { isRecording, startRecording, stopRecording, audioLevel } = useVoiceRecorder()
  const { doubaoAsr } = useSettings()
  // const { t } = useTranslation()
  const [isProcessing, setIsProcessing] = useState(false)
  const stopRef = useRef<(() => Promise<void>) | undefined>(undefined)

  useEffect(() => {
    onRecordingStateChange(isRecording || isProcessing)
  }, [isRecording, isProcessing, onRecordingStateChange])

  const handleStop = async () => {
    if (!isRecording) return

    try {
      setIsProcessing(true)
      const blob = await stopRecording()

      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = async () => {
        const base64data = reader.result as string
        const base64Content = base64data.split(',')[1]

        try {
          const text = await window.electron.ipcRenderer.invoke(IpcChannel.Doubao_ASR, base64Content, doubaoAsr)
          if (text) {
            onTranscribe(text)
          }
        } catch (err: any) {
          window.toast.error(`ASR Error: ${err.message}`)
        } finally {
          setIsProcessing(false)
        }
      }
    } catch (err) {
      // console.error(err)
      window.toast.error('Processing failed')
      setIsProcessing(false)
    }
  }
  stopRef.current = handleStop

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isRecording) {
      timer = setTimeout(
        () => {
          if (stopRef.current) stopRef.current()
        },
        5 * 60 * 1000
      )
    }
    return () => clearTimeout(timer)
  }, [isRecording])

  const handleStart = async () => {
    if (!doubaoAsr?.appId || !doubaoAsr?.accessToken) {
      window.toast.error('Please configure Doubao ASR credentials in settings')
      return
    }
    try {
      await startRecording()
    } catch (err) {
      window.toast.error('Failed to access microphone')
    }
  }

  const handleClick = () => {
    if (isRecording) {
      handleStop()
    } else {
      handleStart()
    }
  }

  const getIcon = () => {
    if (isProcessing) return <Loader2 size={18} className="animate-spin" />
    if (isRecording) {
      // Simple visualization: scale or color based on audioLevel
      // audioLevel is roughly 0-255.
      // We can make the square pulse.
      return <Square size={16} fill="currentColor" />
    }
    return <Mic size={18} />
  }

  return (
    <Tooltip title={isRecording ? 'Stop Recording' : 'Voice Input'}>
      <Button
        type="text"
        icon={getIcon()}
        onClick={handleClick}
        disabled={disabled && !isRecording && !isProcessing}
        style={{
          color: isRecording ? '#ff4d4f' : 'var(--color-text)',
          transition: 'all 0.2s',
          transform: isRecording ? `scale(${1 + Math.min(audioLevel / 100, 0.2)})` : 'scale(1)'
        }}
      />
    </Tooltip>
  )
}
