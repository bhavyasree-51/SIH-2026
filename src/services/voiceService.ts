import type { Language } from '../i18n/translations'

export type RecognitionResult = {
  text: string
  isFinal: boolean
}

export interface VoiceService {
  supported: boolean
  requestPermission(): Promise<void>
  unlockAudio(): void
  start(
    language: Language,
    onResult: (result: RecognitionResult) => void,
    onError: (message: string) => void,
    onEnd: (finalTranscript: string) => void
  ): void
  stop(): void
  speak(text: string, language: Language): Promise<void>
}

type SpeechRecognitionType = {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onresult: ((event: any) => void) | null
  onerror: ((event: any) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:8000'

function cleanTextForSpeech(text: string): string {
  return text
    .replace(/[*_#`~>[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export class BrowserVoiceService implements VoiceService {
  private recognition: SpeechRecognitionType | null = null
  private voices: SpeechSynthesisVoice[] = []
  private currentAudio: HTMLAudioElement | null = null
  private silenceTimer: any = null
  private isListening = false
  private latestTranscript = ''
  private onEndCallback: ((finalTranscript: string) => void) | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.loadVoices()
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices()
      }
    }
  }

  private loadVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        this.voices = window.speechSynthesis.getVoices()
      } catch {
        // ignore
      }
    }
  }

  supported =
    typeof window !== 'undefined' &&
    Boolean(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    )

  unlockAudio() {
    // Unlocks browser audio
    if (typeof window !== 'undefined') {
      try {
        const dummy = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA')
        dummy.play().catch(() => {})
      } catch {
        // ignore
      }
    }
  }

  async requestPermission() {
    this.unlockAudio()
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        stream.getTracks().forEach((track) => track.stop())
      } catch (err) {
        console.warn('Microphone permission request note:', err)
      }
    }
  }

  start(
    language: Language,
    onResult: (result: RecognitionResult) => void,
    onError: (message: string) => void,
    onEnd: (finalTranscript: string) => void
  ) {
    this.unlockAudio()
    const browserWindow = window as any
    const Constructor =
      browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition

    if (!Constructor) {
      onError(
        language === 'te'
          ? 'ఈ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ సపోర్ట్ లేదు. దయచేసి కింద ఇచ్చిన ప్రశ్నలపై క్లిక్ చేయండి లేదా టైప్ చేయండి.'
          : language === 'hi'
            ? 'इस ब्राउज़र में आवाज पहचान समर्थित नहीं है। कृपया नीचे दिए गए विषयों पर क्लिक करें या लिखें।'
            : 'Speech recognition is not supported in this browser. Please click any topic below or type your query.'
      )
      return
    }

    try {
      if (this.recognition) {
        try {
          this.recognition.abort()
        } catch {
          // ignore
        }
        this.recognition = null
      }

      this.latestTranscript = ''
      this.onEndCallback = onEnd
      this.isListening = true

      const recognition: SpeechRecognitionType = new Constructor()
      this.recognition = recognition

      const langCode = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-IN'
      recognition.lang = langCode
      recognition.continuous = true
      recognition.interimResults = true
      recognition.maxAlternatives = 2

      const resetSilenceTimer = () => {
        if (this.silenceTimer) clearTimeout(this.silenceTimer)
        this.silenceTimer = setTimeout(() => {
          if (this.isListening && this.latestTranscript.trim()) {
            this.stop()
          }
        }, 2200)
      }

      recognition.onresult = (event: any) => {
        let fullTranscript = ''
        let isFinal = false

        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i]
          if (res && res[0]) {
            fullTranscript += res[0].transcript
            if (res.isFinal) isFinal = true
          }
        }

        const trimmed = fullTranscript.trim()
        if (trimmed) {
          this.latestTranscript = trimmed
          onResult({
            text: trimmed,
            isFinal,
          })
          resetSilenceTimer()
        }
      }

      recognition.onerror = (event: any) => {
        const err = event.error || ''
        if (err === 'no-speech') {
          return
        }
        if (err === 'aborted') {
          return
        }
        if (err === 'not-allowed' || err === 'service-not-allowed') {
          this.isListening = false
          onError(
            language === 'te'
              ? 'మైక్రోఫోన్ అనుమతి అవసరం. దయచేసి బ్రౌజర్‌లో మైక్రోఫోన్ అనుమతించండి లేదా క్రింది ప్రశ్నలపై క్లిక్ చేయండి.'
              : language === 'hi'
                ? 'माइक्रोफ़ोन की अनुमति आवश्यक है। कृपया ब्राउज़र में अनुमति दें या नीचे दिए गए विषयों पर क्लिक करें।'
                : 'Microphone permission needed. Please allow mic or click any precision topic below.'
          )
          return
        }
        if (err === 'network') {
          this.isListening = false
          const captured = this.latestTranscript.trim()
          if (captured && this.onEndCallback) {
            const cb = this.onEndCallback
            this.onEndCallback = null
            cb(captured)
          } else {
            onError(
              language === 'te'
                ? 'వాయిస్ సర్వీస్ నెట్‌వర్క్ సమస్య. దయచేసి కింద ఇచ్చిన ప్రశ్నలపై క్లిక్ చేయండి లేదా టైప్ చేయండి.'
                : language === 'hi'
                  ? 'आवाज सेवा में नेटवर्क समस्या। कृपया नीचे दिए गए विषयों पर क्लिक करें या टाइप करें।'
                  : 'Voice network unavailable. Please click any precision topic below or type your question.'
            )
          }
          return
        }
      }

      recognition.onend = () => {
        if (this.silenceTimer) {
          clearTimeout(this.silenceTimer)
          this.silenceTimer = null
        }
        this.isListening = false
        this.recognition = null

        const captured = this.latestTranscript.trim()
        if (this.onEndCallback) {
          const cb = this.onEndCallback
          this.onEndCallback = null
          cb(captured)
        }
      }

      recognition.start()
    } catch (err) {
      this.isListening = false
      onError(err instanceof Error ? err.message : 'Could not start microphone listening.')
    }
  }

  stop() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer)
      this.silenceTimer = null
    }

    if (this.currentAudio) {
      try {
        this.currentAudio.pause()
        this.currentAudio.currentTime = 0
      } catch {
        // ignore
      }
      this.currentAudio = null
    }

    if (this.recognition) {
      try {
        this.recognition.stop()
      } catch {
        try {
          this.recognition.abort()
        } catch {
          // ignore
        }
      }
    } else if (this.isListening) {
      this.isListening = false
      if (this.onEndCallback) {
        const cb = this.onEndCallback
        this.onEndCallback = null
        cb(this.latestTranscript.trim())
      }
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel()
      } catch {
        // ignore
      }
    }
  }

  async speak(text: string, language: Language): Promise<void> {
    const cleanText = cleanTextForSpeech(text)
    if (!cleanText) return

    this.stop()
    this.unlockAudio()

    // 1. Primary Method: Web Speech API SpeechSynthesis (Optimized for Android WebView & Median APK)
      return new Promise<void>((resolve) => {
        try {
          window.speechSynthesis.cancel()

          if (!this.voices || this.voices.length === 0) {
            this.loadVoices()
          }

          const utterance = new SpeechSynthesisUtterance(cleanText)
          this.activeUtterance = utterance
          utterance.lang = langCode
          utterance.rate = 0.95
          utterance.pitch = 1.0

          if (this.voices && this.voices.length > 0) {
            const match = this.voices.find(
              (v) =>
                v.lang === langCode ||
                v.lang.toLowerCase().replace('_', '-').startsWith(langCode.toLowerCase()) ||
                v.lang.toLowerCase().startsWith(language)
          }

          utterance.onerror = () => {
            this.activeUtterance = null
            window.speechSynthesis.resume()
                window.speechSynthesis.resume()
              }
              window.speechSynthesis.speak(utterance)
            } catch {
              resolve()
      const audio = new Audio()
      audio.crossOrigin = 'anonymous'
      this.currentAudio = audio

      await new Promise<void>((resolve) => {
        audio.onended = () => {
          this.currentAudio = null
          resolve()
        }
        audio.onerror = () => {
          this.currentAudio = null
          resolve()
        }
        audio.src = audioUrl
        audio.play().catch(() => resolve())
      })
    } catch {
      // ignore
    }
  }
}

export const browserVoiceService = new BrowserVoiceService()