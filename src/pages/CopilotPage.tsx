import { useEffect, useRef, useState } from 'react'
import {
  AlertCircle,
  Bot,
  Globe2,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Trash2,
  User,
  Volume2,
  Waves,
} from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { getVoiceCopy } from '../i18n/voiceTranslations'
import { useVoiceAssistant } from '../hooks/useVoiceAssistant'
import { browserVoiceService } from '../services/voiceService'
import type { Language } from '../i18n/translations'

type ChatMessage = {
  id: string
  sender: 'user' | 'ai'
  text: string
  lang?: Language
  timestamp: string
}

export function CopilotPage() {
  const { language, setLanguage } = useI18n()
  const [activeLang, setActiveLang] = useState<Language>(language)
  const assistant = useVoiceAssistant(activeLang)
  const [question, setQuestion] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const copy = (key: Parameters<typeof getVoiceCopy>[1]) => getVoiceCopy(activeLang, key)
  const statusText = copy(assistant.status === 'error' ? 'error' : assistant.status)

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text:
        activeLang === 'hi'
          ? 'नमस्ते किसान साथी! मैं आपका किसान कोपायलट हूँ। अपने खेत, मौसम, सिंचाई या फसल रोग के बारे में अपनी भाषा में पूछें।'
          : activeLang === 'te'
            ? 'నమస్కారం రైతు మిత్రమా! నేను మీ కిసాన్ కోపైలట్. మీ పొలం, వాతావరణం, నీటిపారుదల లేదా పంట తెగుళ్ల గురించి మీ భాషలో అడగండి.'
            : 'Hello farmer! I am your Kisan Copilot. Ask me anything about farm health, irrigation, weather, fertilizers, or crop diseases in English, Hindi, or Telugu.',
      lang: activeLang,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, assistant.status])

  const handleLanguageChange = (lang: Language) => {
    setActiveLang(lang)
    setLanguage(lang)
    setMessages([
      {
        id: `welcome-${lang}-${Date.now()}`,
        sender: 'ai',
        text:
          lang === 'hi'
            ? 'नमस्ते किसान साथी! मैं आपका किसान कोपायलट हूँ। अपने खेत, मौसम, सिंचाई या फसल रोग के बारे में अपनी भाषा में पूछें।'
            : lang === 'te'
              ? 'నమస్కారం రైతు మిత్రమా! నేను మీ కిసాన్ కోపైలట్. మీ పొలం, వాతావరణం, నీటిపారుదల లేదా పంట తెగుళ్ల గురించి మీ భాషలో అడగండి.'
              : 'Hello farmer! I am your Kisan Copilot. Ask me anything about farm health, irrigation, weather, fertilizers, or crop diseases in English, Hindi, or Telugu.',
        lang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
  }

  const promptSuggestions: Record<Language, { label: string; text: string }[]> = {
    en: [
      { label: '🌸 Stop Flower & Fruit Drop', text: 'How to stop flower and fruit drop in tomato and chilli?' },
      { label: '🐛 Thrips & Mites Control', text: 'What is the best pesticide for thrips and mites in chilli?' },
      { label: '🧪 1-Acre Fertilizer Dosage', text: 'What is the recommended fertilizer dosage per acre for tomato?' },
      { label: '🍃 Whitefly & Leaf Curl', text: 'How to control whitefly and leaf curl virus in vegetables?' },
      { label: '🌾 Paddy Stem Borer & Blast', text: 'How to control stem borer and blast in paddy?' },
      { label: '🌿 Jeevamrutham Recipe', text: 'How to prepare and apply Jeevamrutham organic fertilizer?' },
      { label: '💰 PMKSY 80-90% Subsidies', text: 'What are the government subsidies for drip irrigation under PMKSY?' },
      { label: '💧 Drip Irrigation Timing', text: 'Should I irrigate my tomato field today?' },
    ],
    hi: [
      { label: '🌸 फूल व फल गिरना रोकें', text: 'टमाटर और मिर्च में फूल व फल गिरना कैसे रोकें?' },
      { label: '🐛 थ्रिप्स और माइट्स की दवा', text: 'मिर्च में थ्रिप्स और माइट्स की रोकथाम के लिए कौन सी दवा डालें?' },
      { label: '🧪 प्रति एकड़ खाद की मात्रा', text: 'टमाटर की फसल में प्रति एकड़ कितनी खाद और उर्वरक डालें?' },
      { label: '🍃 सफेद मक्खी और पत्ती मुड़ना', text: 'सफेद मक्खी और लीफ कर्ल वायरस का उपचार क्या है?' },
      { label: '🌾 धान में तना छेदक व झुलसा', text: 'धान में तना छेदक और ब्लास्ट रोग का नियंत्रण कैसे करें?' },
      { label: '🌿 जीवामृत बनाने की विधि', text: 'जीवामृत कैसे बनाएं और खेत में कैसे डालें?' },
      { label: '💰 ड्रिप पर 80-90% सब्सिडी', text: 'ड्रिप सिंचाई के लिए सरकारी सब्सिडी कैसे पाएं?' },
      { label: '💧 सिंचाई का सही समय', text: 'क्या मुझे आज टमाटर के खेत में पानी देना चाहिए?' },
    ],
    te: [
      { label: '🌸 పూత, పిందె రాలడం నివారణ', text: 'టమాటా మరియు మిరపలో పూత, పిందె రాలడం నివారించడానికి ఏ మందు వాడాలి?' },
      { label: '🐛 తామర పురుగులు & నల్లి నివారణ', text: 'మిరపలో తామర పురుగులు (థ్రిప్స్) మరియు నల్లి నివారణకు ఏ మందు కొట్టాలి?' },
      { label: '🧪 ఎకరాకు ఎరువుల మోతాదు', text: 'టమాటా మరియు వరి పంటకు ఎకరాకు సిఫార్సు చేసిన ఎరువుల మోతాదు ఎంత?' },
      { label: '🍃 తెల్లదోమ & ఆకు ముడుత', text: 'కూరగాయలలో తెల్లదోమ మరియు ఆకు ముడుత వైరస్ నివారణ ఎలా?' },
      { label: '🌾 వరిలో కాండం తొలిచే పురుగు', text: 'వరిలో కాండం తొలిచే పురుగు మరియు అగ్గి తెగులు నివారణ ఎలా?' },
      { label: '🌿 జీవామృతం తయారీ విధానం', text: 'జీవామృతం ఎలా తయారు చేసుకోవాలి మరియు ఎలా వాడాలి?' },
      { label: '💰 డ్రిప్ 80-90% సబ్సిడీలు', text: 'ప్రధానమంత్రి కృషి సంచాయి యోజన (PMKSY) డ్రిప్ సబ్సిడీ వివరాలు ఏమిటి?' },
      { label: '💧 నీటిపారుదల సమయం', text: 'ఈ రోజు టమాటా పొలానికి నీరు పెట్టాలా?' },
    ],
  }

  const handleAsk = async (text: string) => {
    const clean = text.trim()
    if (!clean) return

    browserVoiceService.unlockAudio()

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: clean,
      lang: activeLang,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, userMsg])
    setQuestion('')

    const aiAnswer = await assistant.answer(clean, activeLang)
    if (aiAnswer) {
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiAnswer,
        lang: activeLang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, aiMsg])
    }
  }

  const handleStartListening = () => {
    browserVoiceService.unlockAudio()
    if (assistant.status === 'listening') {
      assistant.stop()
    } else {
      void assistant.start(
        activeLang,
        (spokenText) => {
          const userMsg: ChatMessage = {
            id: `user-${Date.now()}`,
            sender: 'user',
            text: spokenText,
            lang: activeLang,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
          setMessages((prev) => [...prev, userMsg])
        },
        (aiAnswer) => {
          const aiMsg: ChatMessage = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: aiAnswer,
            lang: activeLang,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
          setMessages((prev) => [...prev, aiMsg])
        }
      )
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-msg',
        sender: 'ai',
        text:
          activeLang === 'hi'
            ? 'नमस्ते किसान साथी! मैं आपका किसान कोपायलट हूँ। अपने खेत के बारे में कुछ भी पूछें।'
            : activeLang === 'te'
              ? 'నమస్కారం రైతు మిత్రమా! నేను మీ కిసాన్ కోపైలట్. మీ పొలం గురించి ఏదైనా అడగండి.'
              : 'Hello farmer! I am your Kisan Copilot. Ask me anything about your farm.',
        lang: activeLang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
  }

  return (
    <div className="module-page voice-page">
      {/* Header Banner */}
      <div className="module-header">
        <div>
          <span className="section-kicker">AI VOICE ASSISTANT</span>
          <h1>Kisan Mitra Voice Copilot</h1>
          <p>
            Native agricultural voice assistant in <strong>Telugu (తెలుగు)</strong>, <strong>Hindi (हिंदी)</strong>, and <strong>English</strong>.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="data-badge">
            <Sparkles size={14} /> AI4Bharat IndicTrans2 Engine
          </span>
        </div>
      </div>

      {/* Language Selector Bar */}
      <div className="voice-lang-bar">
        <div className="lang-bar-label">
          <Globe2 size={16} /> Spoken Language
        </div>
        <div className="lang-buttons">
          <button
            type="button"
            className={`lang-pill ${activeLang === 'en' ? 'active' : ''}`}
            onClick={() => handleLanguageChange('en')}
          >
            English
          </button>
          <button
            type="button"
            className={`lang-pill ${activeLang === 'hi' ? 'active' : ''}`}
            onClick={() => handleLanguageChange('hi')}
          >
            हिंदी (Hindi)
          </button>
          <button
            type="button"
            className={`lang-pill ${activeLang === 'te' ? 'active' : ''}`}
            onClick={() => handleLanguageChange('te')}
          >
            తెలుగు (Telugu)
          </button>
        </div>
      </div>

      <div className="two-column-layout voice-layout">
        {/* Left Column: Voice Controls & Orb */}
        <section className="card panel voice-control-panel">
          <h2>Voice Interaction</h2>

          <div className="orb-wrapper">
            <div
              className={`voice-orb orb-${assistant.status}`}
              onClick={handleStartListening}
              title="Click to speak"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleStartListening()}
            >
              {assistant.status === 'listening' ? (
                <Waves size={36} className="orb-icon" />
              ) : assistant.status === 'speaking' ? (
                <Volume2 size={36} className="orb-icon" />
              ) : assistant.status === 'processing' || assistant.status === 'answering' ? (
                <Bot size={36} className="orb-icon" />
              ) : (
                <Mic size={36} className="orb-icon" />
              )}
            </div>

            <div className="orb-status-text">
              <span className={`status-dot dot-${assistant.status}`} />
              <strong>{statusText}</strong>
            </div>

            {assistant.transcript && (
              <div className="live-transcript">
                <span className="transcript-label">
                  {activeLang === 'te' ? 'మీరు అడిగిన ప్రశ్న:' : activeLang === 'hi' ? 'आपका सवाल:' : 'You asked:'}
                </span>
                <p>"{assistant.transcript}"</p>
              </div>
            )}

            {assistant.error && (
              <div className="voice-error-box">
                <AlertCircle size={15} />
                <span>{assistant.error}</span>
              </div>
            )}
          </div>

          <div className="voice-actions">
            <button
              type="button"
              className={`primary-btn mic-btn ${assistant.status === 'listening' ? 'btn-danger' : ''}`}
              onClick={handleStartListening}
            >
              {assistant.status === 'listening' ? (
                <>
                  <MicOff size={18} /> {copy('stopListening')}
                </>
              ) : (
                <>
                  <Mic size={18} /> {copy('tapToAsk')}
                </>
              )}
            </button>
          </div>
        </section>

        {/* Right Column: Chat History & Recommendations */}
        <section className="card panel chat-panel">
          <div className="chat-panel-header">
            <h2>Conversation Advisory</h2>
            <button type="button" className="ghost-btn" onClick={clearChat} title="Clear conversation">
              <Trash2 size={15} /> Clear Chat
            </button>
          </div>

          <div className="chat-history">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble-row ${msg.sender}`}>
                <div className="bubble-avatar">
                  {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className="bubble-content">
                  <div className="bubble-header">
                    <span className="bubble-sender">{msg.sender === 'user' ? 'You' : 'Kisan Copilot'}</span>
                    <span className="bubble-time">{msg.timestamp}</span>
                  </div>
                  <p className="bubble-text">{msg.text}</p>
                  {msg.sender === 'ai' && (
                    <button
                      type="button"
                      className="bubble-action-btn"
                      onClick={() => {
                        browserVoiceService.unlockAudio()
                        void assistant.speakAgain(msg.text, msg.lang || activeLang)
                      }}
                      title="Read aloud"
                    >
                      <Volume2 size={13} /> {activeLang === 'te' ? 'వినండి' : activeLang === 'hi' ? 'सुनें' : 'Listen'}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="quick-prompts-section">
            <span className="quick-prompts-title">💡 Precision Farming Topics:</span>
            <div className="quick-prompts-grid">
              {promptSuggestions[activeLang].map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="quick-prompt-btn"
                  onClick={() => void handleAsk(p.text)}
                  disabled={assistant.status === 'listening' || assistant.status === 'answering'}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text Input */}
          <form
            className="chat-input-form"
            onSubmit={(e) => {
              e.preventDefault()
              void handleAsk(question)
            }}
          >
            <input
              type="text"
              placeholder={
                activeLang === 'hi'
                  ? 'अपना कृषि सवाल यहाँ लिखें...'
                  : activeLang === 'te'
                    ? 'మీ వ్యవసాయ ప్రశ్నను ఇక్కడ రాయండి...'
                    : 'Type your farming question here...'
              }
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={assistant.status === 'listening' || assistant.status === 'answering'}
            />
            <button
              type="submit"
              className="send-btn"
              disabled={!question.trim() || assistant.status === 'listening' || assistant.status === 'answering'}
              aria-label="Send"
            >
              <Send size={18} />
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}