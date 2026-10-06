import { useEffect, useRef, useState } from 'react'
import type { Language } from '../i18n/translations'
import { demoAIService, detectLanguage, type AIService } from '../services/aiService'
import { browserVoiceService, type VoiceService } from '../services/voiceService'

export type VoiceStatus = 'ready' | 'listening' | 'processing' | 'answering' | 'speaking' | 'error'

export function useVoiceAssistant(
  language: Language,
  voice: VoiceService = browserVoiceService,
  ai: AIService = demoAIService
) {
  const [status, setStatus] = useState<VoiceStatus>('ready')
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')
  const [responseLanguage, setResponseLanguage] = useState<Language>(language)
  const currentTranscriptRef = useRef('')

  useEffect(() => () => voice.stop(), [voice])

  const answer = async (
    question: string,
    overrideLang?: Language,
    onAnswerGenerated?: (answer: string) => void
  ): Promise<string> => {
    const cleanQuestion = question.trim()
    if (!cleanQuestion) return ''

    setTranscript(cleanQuestion)
    setError('')
    setStatus('answering')

    const targetLang = overrideLang || detectLanguage(cleanQuestion, language)
    setResponseLanguage(targetLang)

    try {
      const result = await ai.answer(cleanQuestion, targetLang)
      setResponse(result)
      if (onAnswerGenerated) {
        onAnswerGenerated(result)
      }
      setStatus('speaking')
      await voice.speak(result, targetLang)
      setStatus('ready')
      return result
    } catch (reason) {
      const msg = reason instanceof Error ? reason.message : 'Voice response failed'
      setError(msg)
      setStatus('error')
      return ''
    }
  }

  const start = async (
    listenLang?: Language,
    onQuestionCaptured?: (spokenText: string) => void,
    onAnswerGenerated?: (answerText: string) => void
  ) => {
    setError('')
    setTranscript('')
    setResponse('')
    currentTranscriptRef.current = ''
    const currentLang = listenLang || language

    try {
      await voice.requestPermission()
      setStatus('listening')

      voice.start(
        currentLang,
        ({ text }) => {
          setTranscript(text)
          currentTranscriptRef.current = text
        },
        (errMsg) => {
          setError(errMsg)
          setStatus('error')
        },
        (finalTranscript) => {
          const spoken = (finalTranscript || currentTranscriptRef.current).trim()
          if (spoken) {
            if (onQuestionCaptured) {
              onQuestionCaptured(spoken)
            }
            void answer(spoken, currentLang, onAnswerGenerated)
          } else {
            setStatus('ready')
          }
        }
      )
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Microphone permission was denied')
      setStatus('error')
    }
  }

  const stop = () => {
    voice.stop()
  }

  const speakAgain = async (customText?: string, customLang?: Language) => {
    const textToSpeak = customText || response
    if (!textToSpeak) return
    setStatus('speaking')
    try {
      await voice.speak(textToSpeak, customLang || responseLanguage || language)
      setStatus('ready')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Text-to-speech failed')
      setStatus('error')
    }
  }

  return {
    status,
    transcript,
    response,
    error,
    responseLanguage,
    supported: voice.supported,
    start,
    stop,
    answer,
    speakAgain,
  }
}