import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  MessageSquare,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  UserCheck,
  X,
} from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'

interface FarmerHelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FarmerHelpModal({ isOpen, onClose }: FarmerHelpModalProps) {
  const { language } = useI18n()
  const navigate = useNavigate()
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  if (!isOpen) return null

  const isTe = language === 'te'
  const isHi = language === 'hi'

  const title = isTe
    ? 'రైతు సహాయ కేంద్రం & కిసాన్ కాల్ సెంటర్'
    : isHi
      ? 'किसान सहायता केंद्र एवं कॉल सेंटर'
      : 'Kisan Help Center & Farm Support'

  const subtitle = isTe
    ? 'మీ వ్యవసాయ సమస్యలకు 24/7 ప్రభుత్వ అధికారులు మరియు AI నిపుణుల సలహాలు'
    : isHi
      ? 'आपकी कृषि समस्याओं के लिए 24/7 सरकारी विशेषज्ञ और एआई सहायता'
      : '24/7 Expert agricultural guidance, emergency hotlines & AI assistance'

  const faqs = isTe
    ? [
        {
          q: 'పురుగులు లేదా తెగుళ్లు ఆకస్మికంగా సోకితే ఏం చేయాలి?',
          a: 'వెంటనే మా "వ్యాధి గుర్తింపు (Disease Scanner)" లో ఆకు ఫోటో తీసి అప్‌లోడ్ చేయండి. ఖచ్చితమైన రసాయన, సేంద్రీయ మందుల మోతాదును తెలుసుకోండి లేదా టోల్-ఫ్రీ 1551 కి కాల్ చేయండి.',
        },
        {
          q: 'పిఎం కిసాన్ / రైతు భరోసా పథకం సహాయం ఎలా పొందాలి?',
          a: 'మీ సమీప రైతు సేవా కేంద్రం (RBK/KVK) లేదా స్థానిక వ్యవసాయ విస్తరణ అధికారి (AEO) ని సంప్రదించండి. టోల్ ఫ్రీ 155261 ద్వారా మీ ఆధార్ లింక్ స్టేటస్ తెలుసుకోవచ్చు.',
        },
        {
          q: 'డ్రిప్ ఇరిగేషన్ సబ్సిడీ ఎంత లభిస్తుంది?',
          a: 'చిన్న, సన్నకారు రైతులకు PMKSY కింద 80% నుండి 90% వరకు ప్రభుత్వ సబ్సిడీ లభిస్తుంది.',
        },
      ]
    : isHi
      ? [
          {
            q: 'फसल में अचानक कीट या रोग लगने पर क्या करें?',
            a: 'तुरंत हमारे "रोग पहचान (Disease Detection)" टूल में पत्ती की फोटो अपलोड करें या किसान कॉल सेंटर 1800-180-1551 पर मुफ्त कॉल करें।',
          },
          {
            q: 'पीएम-किसान सम्मान निधि के लिए सहायता कहां से मिलेगी?',
            a: 'अपने नजदीकी कृषि विज्ञान केंद्र (KVK) या ग्राम सेवक से संपर्क करें। पीएम-किसान हेल्पलाइन 155261 या 011-24300606 पर संपर्क करें।',
          },
          {
            q: 'ड्रिप सिंचाई एवं सौर पंप पर कितनी सब्सिडी है?',
            a: 'पीएम कुसुम और पीएमकेएसवाई योजना के तहत छोटे व सीमांत किसानों को 70% से 90% तक सब्सिडी मिलती है।',
          },
        ]
      : [
          {
            q: 'What should I do during sudden pest outbreaks or leaf blights?',
            a: 'Immediately upload a leaf photo to our "Disease Detection" tool to get exact chemical & organic spray dosages, or call the Toll-Free Kisan Call Center at 1551.',
          },
          {
            q: 'How do I check PM-Kisan / Rythu Bharosa subsidy status?',
            a: 'Contact your local Village Agricultural Extension Officer (AEO) or call the central PM-Kisan helpline at 155261.',
          },
          {
            q: 'How much subsidy is available for Drip Irrigation?',
            a: 'Under PMKSY (Per Drop More Crop), small and marginal farmers receive 80% to 90% government subsidy on micro-irrigation systems.',
          },
        ]

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          maxWidth: 620,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: 24,
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#475569',
          }}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div
            style={{
              background: '#e8f5e9',
              color: '#2e7d32',
              width: 42,
              height: 42,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HelpCircle size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              {title}
            </h2>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>{subtitle}</p>
          </div>
        </div>

        {/* Emergency Hotlines Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginTop: 18 }}>
          {/* Kisan Call Center (Govt of India) */}
          <div
            style={{
              border: '1.5px solid #c8e6c9',
              borderRadius: 12,
              background: '#f4fbf5',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#1b5e20', fontWeight: 700, fontSize: '0.88rem', marginBottom: 4 }}>
                <PhoneCall size={16} />
                <span>{isTe ? 'కిసాన్ కాల్ సెంటర్ (ఉచితం)' : isHi ? 'किसान कॉल सेंटर (टोल-फ्री)' : 'Kisan Call Center (Toll-Free)'}</span>
              </div>
              <p style={{ margin: '0 0 10px', fontSize: '0.78rem', color: '#475569' }}>
                {isTe ? 'ఉదయం 6:00 నుండి రాత్రి 10:00 వరకు వ్యవసాయ నిపుణుల సలహాలు' : isHi ? 'सुबह 6 से रात 10 बजे तक वैज्ञानिकों से मुफ्त सलाह' : 'Direct Govt Agri Scientists (6:00 AM – 10:00 PM)'}
              </p>
            </div>
            <a
              href="tel:18001801551"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                background: '#1b5e20',
                color: '#ffffff',
                textDecoration: 'none',
                padding: '8px 14px',
                borderRadius: 8,
                fontSize: '0.86rem',
                fontWeight: 700,
              }}
            >
              <PhoneCall size={14} /> 1800-180-1551 / 1551
            </a>
          </div>

          {/* AI Voice Agronomist 24/7 */}
          <div
            style={{
              border: '1.5px solid #bbdefb',
              borderRadius: 12,
              background: '#f0f7ff',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#0d47a1', fontWeight: 700, fontSize: '0.88rem', marginBottom: 4 }}>
                <Sparkles size={16} />
                <span>{isTe ? 'కిసాన్ AI వాయిస్ అసిస్టెంట్' : isHi ? 'किसान एआई वॉइस असिस्टेंट' : '24/7 Kisan AI Voice Copilot'}</span>
              </div>
              <p style={{ margin: '0 0 10px', fontSize: '0.78rem', color: '#475569' }}>
                {isTe ? 'ఏ ప్రశ్నకైనా మీ భాషలోనే తక్షణ శాస్త్రీయ సమాధానాలు' : isHi ? 'अपनी भाषा में 100% सटीक कृषि उत्तर तुरंत पाएं' : 'Instant ICAR & Gemini AI recommendations in your language'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose()
                navigate('/farmer/voice')
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                padding: '8px 14px',
                borderRadius: 8,
                fontSize: '0.86rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <MessageSquare size={14} /> {isTe ? 'వాయిస్ అసిస్టెంట్‌ని తెరవండి' : isHi ? 'वॉइस असिस्टेंट खोलें' : 'Open Voice Copilot'}
            </button>
          </div>
        </div>

        {/* Extension Support Links */}
        <div style={{ marginTop: 16, background: '#f8fafc', borderRadius: 12, padding: '12px 14px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.86rem', fontWeight: 700, color: '#334155' }}>
              <UserCheck size={16} style={{ color: '#0284c7' }} />
              <span>{isTe ? 'జిల్లా వ్యవసాయ విస్తరణ అధికారి (KVK)' : isHi ? 'कृषि विज्ञान केंद्र (KVK) व ग्राम सेवक' : 'Krishi Vigyan Kendra (KVK) Extension'}</span>
            </div>
            <a
              href="https://kvk.icar.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#0284c7', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}
            >
              kvk.icar.gov.in <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
            <BookOpen size={16} style={{ color: '#2e7d32' }} />
            <span>{isTe ? 'తరచుగా అడిగే ప్రశ్నలు (FAQ)' : isHi ? 'अक्सर पूछे जाने वाले सवाल' : 'Frequently Asked Farm Questions'}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {faqs.map((item, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  overflow: 'hidden',
                  background: activeFaq === idx ? '#f8fafc' : '#ffffff',
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    color: '#1e293b',
                  }}
                >
                  <span>{item.q}</span>
                  <ChevronRight
                    size={16}
                    style={{
                      transform: activeFaq === idx ? 'rotate(90deg)' : 'none',
                      transition: 'transform 0.2s ease',
                      color: '#64748b',
                    }}
                  />
                </button>
                {activeFaq === idx && (
                  <div style={{ padding: '0 14px 12px', fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem', color: '#94a3b8' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ShieldCheck size={14} style={{ color: '#16a34a' }} /> ICAR & Ministry of Agriculture Certified
          </span>
          <span>Kisan Mitra v2.0</span>
        </div>
      </div>
    </div>
  )
}

