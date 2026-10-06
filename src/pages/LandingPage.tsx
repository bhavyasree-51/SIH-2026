import { Link } from 'react-router-dom'
import { ArrowRight, Globe, HeartHandshake, ShieldCheck, Sprout, Wheat } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useI18n } from '../i18n/I18nProvider'

export function LandingPage() {
  const { user } = useAuth()
  const { language, setLanguage } = useI18n()

  const farmerHref = user?.role === 'FARMER' ? '/farmer/dashboard' : '/login/farmer'
  const volunteerHref = user?.role === 'ADMIN' ? '/admin/dashboard' : '/login/volunteer'

  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="auth-brand">
          <img src="/logo.png" alt="Kisan Mitra Logo" className="brand-logo-img" />
          <div>
            <strong>Kisan<span>Mitra</span></strong>
            <small style={{ display: 'block', fontSize: '0.68rem', color: '#16a34a', fontWeight: 700 }}>
              SMART KRISHI SAHAYAK
            </small>
          </div>
        </div>

        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '4px 10px' }}>
            <Globe size={15} style={{ color: '#16a34a' }} />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              style={{ background: 'transparent', border: 'none', fontWeight: 600, fontSize: '0.84rem', color: '#166534', outline: 'none', cursor: 'pointer' }}
            >
              <option value="te">తెలుగు (Telugu)</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="en">English</option>
            </select>
          </div>

          <Link to={farmerHref} style={{ fontWeight: 600, color: '#166534' }}>
            {language === 'te' ? 'రైతు లాగిన్' : language === 'hi' ? 'किसान लॉगिन' : 'Farmer Login'}
          </Link>
          <Link
            to={volunteerHref}
            style={{
              fontWeight: 600,
              color: '#0f766e',
              background: '#ccfbf1',
              padding: '6px 12px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '0.84rem',
            }}
          >
            {language === 'te' ? 'వాలంటీర్ పోర్టల్' : language === 'hi' ? 'स्वयंसेवक पोर्टल' : 'Volunteer Portal'}
          </Link>
        </div>
      </nav>

      <main className="hero">
        <div className="hero-copy">
          <span className="section-kicker">
            <Wheat size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
            {language === 'te'
              ? 'స్మార్ట్ వ్యవసాయ సహాయకుడు'
              : language === 'hi'
                ? 'स्मार्ट कृषि सहायक'
                : 'SMART PRECISION AGRICULTURE'}
          </span>
          <h1>
            {language === 'te'
              ? 'కిసాన్ మిత్ర - రైతు మరియు వాలంటీర్ వేదిక'
              : language === 'hi'
                ? 'किसान मित्र - किसान और स्वयंसेवक मंच'
                : 'Welcome to Kisan Mitra'}
          </h1>
          <p>
            {language === 'te'
              ? 'పంట ప్రణాళిక, ప్రత్యక్ష వాతావరణం, ఆకుల ఫోటోతో తెగుళ్ల గుర్తింపు మరియు గ్రామ వాలంటీర్లతో సమన్వయం.'
              : language === 'hi'
                ? 'फसल योजना, लाइव मौसम, पत्ती फोटो द्वारा रोग पहचान और ग्राम स्वयंसेवकों के साथ समन्वय।'
                : 'Empowering farmers with AI leaf disease diagnosis, voice intelligence, and village volunteer support.'}
          </p>

          <div className="hero-actions" style={{ display: 'flex', gap: '14px', marginTop: '24px', flexWrap: 'wrap' }}>
            <Link
              to={farmerHref}
              className="primary-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: 600,
                textDecoration: 'none',
                background: '#16a34a',
                color: '#ffffff',
                borderRadius: '8px',
              }}
            >
              <Sprout size={18} />
              {language === 'te' ? 'రైతు ప్రవేశం (Farmer Access)' : language === 'hi' ? 'किसान प्रवेश (Farmer Access)' : 'Farmer Access'}
            </Link>

            <Link
              to={volunteerHref}
              className="secondary-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: 600,
                textDecoration: 'none',
                background: '#0f766e',
                color: '#ffffff',
                borderRadius: '8px',
              }}
            >
              <HeartHandshake size={18} />
              {language === 'te' ? 'వాలంటీర్ ప్రవేశం (Volunteer Access)' : language === 'hi' ? 'स्वयंसेवक प्रवेश (Volunteer Access)' : 'Volunteer Access'}
            </Link>
          </div>
        </div>

        <div className="feature-grid" style={{ marginTop: '40px' }}>
          <div className="feature-card">
            <div className="feature-icon"><Sprout size={20} /></div>
            <h3>{language === 'te' ? 'పంట తెగుళ్ల గుర్తింపు' : language === 'hi' ? 'पत्ती रोग पहचान' : 'AI Disease Detection'}</h3>
            <p>{language === 'te' ? 'ఆకు ఫోటో తీసి మందుల మోతాదును క్షణాల్లో తెలుసుకోండి.' : language === 'hi' ? 'पत्ती का फोटो अपलोड कर सटीक रासायनिक एवं जैविक उपचार पाएं।' : 'Instant leaf pathology with ICAR chemical and organic spray dosages.'}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><ShieldCheck size={20} /></div>
            <h3>{language === 'te' ? 'వాలంటీర్ నెట్‌వర్క్' : language === 'hi' ? 'ग्राम स्वयंसेवक नेटवर्क' : 'Volunteer Sahayak Desk'}</h3>
            <p>{language === 'te' ? 'క్షేత్రస్థాయి సమస్యలను పరిష్కరించేందుకు గ్రామ వాలంటీర్ల సహాయం.' : language === 'hi' ? 'ग्राम स्तर पर फसल सत्यापन और आपातकालीन अलर्ट प्रसारण।' : 'Field volunteers assist farmers with verifications and emergency alerts.'}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><ArrowRight size={20} /></div>
            <h3>{language === 'te' ? 'వాయిస్ అసిస్టెంట్' : language === 'hi' ? 'आवाज सहायक' : 'Multilingual Voice Copilot'}</h3>
            <p>{language === 'te' ? 'తెలుగు, హిందీ మరియు ఇంగ్లీషులో మాట్లాడి వ్యవసాయ సలహాలు పొందండి.' : language === 'hi' ? 'हिंदी, तेलुगु और अंग्रेजी में बोलकर तुरंत सटीक सलाह पाएं।' : 'Speak in Telugu, Hindi, or English for real-time tailored farm advisory.'}</p>
          </div>
        </div>
      </main>
    </div>
  )
}
