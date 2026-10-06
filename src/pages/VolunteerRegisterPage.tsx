import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HeartHandshake, ShieldCheck } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useI18n } from '../i18n/I18nProvider'
import { registerVolunteerAccount } from '../services/authService'

export function VolunteerRegisterPage() {
  const navigate = useNavigate()
  const { loginPrototype } = useAuth()
  const { language } = useI18n()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [district, setDistrict] = useState('')
  const [state, setState] = useState('Telangana')
  const [designation, setDesignation] = useState('Gram Sahayak / Field Volunteer')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    const cleanName = fullName.trim()
    const cleanPhone = phone.trim()
    const cleanEmail = (email.trim() || `${cleanPhone}@volunteer.kisanmitra.in`).toLowerCase()
    const cleanDistrict = district.trim()
    const cleanState = state.trim()
    const cleanPassword = password.trim()

    if (!cleanName || !cleanPhone || !cleanDistrict || !cleanPassword) {
      setError(
        language === 'te'
          ? 'దయచేసి అన్ని వివరాలను పూరించండి.'
          : language === 'hi'
            ? 'कृपया सभी आवश्यक फ़ील्ड भरें।'
            : 'Please complete all required fields.'
      )
      return
    }

    if (cleanPhone.length < 10) {
      setError(
        language === 'te'
          ? 'చెల్లుబాటు అయ్యే 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి.'
          : language === 'hi'
            ? 'कृपया मान्य 10 अंकों का मोबाइल नंबर दर्ज करें।'
            : 'Please enter a valid 10-digit mobile number.'
      )
      return
    }

    if (cleanPassword.length < 4) {
      setError(
        language === 'te'
          ? 'పాస్‌వర్డ్ కనీసం 4 అక్షరాలు ఉండాలి.'
          : language === 'hi'
            ? 'पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।'
            : 'Password must be at least 4 characters.'
      )
      return
    }

    if (confirmPassword && cleanPassword !== confirmPassword.trim()) {
      setError(
        language === 'te'
          ? 'పాస్‌వర్డ్‌లు సరిపోలడం లేదు.'
          : language === 'hi'
            ? 'पासवर्ड मेल नहीं खाते।'
            : 'Passwords do not match.'
      )
      return
    }

    setBusy(true)
    try {
      // Register volunteer in central local storage
      const newVolunteer = registerVolunteerAccount({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        password: cleanPassword,
        district: cleanDistrict,
        state: cleanState || 'Telangana',
        designation: designation || 'Gram Sahayak / Field Volunteer',
      })

      // Log in as Volunteer Admin
      loginPrototype({
        id: newVolunteer.id,
        email: newVolunteer.email,
        name: `${newVolunteer.name} (${newVolunteer.designation || 'Volunteer'})`,
        role: 'ADMIN',
        location: `${newVolunteer.district}, ${newVolunteer.state}`,
      })

      // Navigate to Volunteer Dashboard
      navigate('/admin/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please check your details.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="section-kicker" style={{ margin: 0 }}>
            <HeartHandshake size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
            {language === 'te'
              ? 'వాలంటీర్ నమోదు'
              : language === 'hi'
                ? 'स्वयंसेवक पंजीकरण'
                : 'VOLUNTEER REGISTRATION'}
          </span>
          <span className="admin-demo" style={{ padding: '2px 8px', fontSize: '0.7rem' }}>
            <ShieldCheck size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '2px' }} />
            SAHAYAK DESK
          </span>
        </div>

        <h1>
          {language === 'te'
            ? 'కిసాన్ వాలంటీర్‌గా చేరండి'
            : language === 'hi'
              ? 'किसान स्वयंसेवक के रूप में जुड़ें'
              : 'Join as a Kisan Volunteer'}
        </h1>
        <p>
          {language === 'te'
            ? 'గ్రామస్థాయిలో రైతులకు తోడ్పాటు అందించడానికి మరియు పంట సమస్యలను పరిష్కరించడానికి నమోదు చేసుకోండి.'
            : language === 'hi'
              ? 'ग्राम स्तर पर किसानों की सहायता करने और फसल समस्याओं को हल करने के लिए पंजीकरण करें।'
              : 'Sign up to support local farmers, verify crop diseases, and broadcast emergency village alerts.'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="fullName">
              {language === 'te' ? 'వాలంటీర్ పూర్తి పేరు' : language === 'hi' ? 'स्वयंसेवक का पूरा नाम' : 'Full Name'} *
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Suresh Kumar"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="field">
              <label htmlFor="phone">
                {language === 'te' ? 'మొబైల్ నంబర్' : language === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'} *
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                maxLength={10}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="email">
                {language === 'te' ? 'ఈమెయిల్ (ఐచ్ఛికం)' : language === 'hi' ? 'ईमेल (वैकल्पिक)' : 'Email ID (Optional)'}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="volunteer@kisanmitra.in"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="field">
              <label htmlFor="district">
                {language === 'te' ? 'కేటాయించిన జిల్లా' : language === 'hi' ? 'आवंटित जिला' : 'Assigned District'} *
              </label>
              <input
                id="district"
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Nalgonda"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="state">
                {language === 'te' ? 'రాష్ట్రం' : language === 'hi' ? 'राज्य' : 'State'}
              </label>
              <input
                id="state"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Telangana"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="designation">
              {language === 'te' ? 'వాలంటీర్ పాత్ర / హోదా' : language === 'hi' ? 'भूमिका / पद' : 'Volunteer Designation / Role'}
            </label>
            <select id="designation" value={designation} onChange={(e) => setDesignation(e.target.value)}>
              <option value="Gram Sahayak / Field Volunteer">Gram Sahayak / Village Volunteer (గ్రామ సహాయకుడు)</option>
              <option value="Agricultural Field Extension Officer">Field Extension Officer (వ్యవసాయ విస్తరణ అధికారి)</option>
              <option value="Plant Pathology & Disease Specialist">Plant Pathology & Crop Health Specialist (పంట రక్షణ నిపుణుడు)</option>
              <option value="Kisan Community Coordinator">Community Forum Coordinator (రైతు వేదిక సమన్వయకర్త)</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="field">
              <label htmlFor="password">
                {language === 'te' ? 'పాస్‌వర్డ్' : language === 'hi' ? 'पासवर्ड' : 'Password'} *
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
                minLength={4}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="confirmPassword">
                {language === 'te' ? 'పాస్‌వర్డ్ నిర్ధారించండి' : language === 'hi' ? 'पासवर्ड की पुष्टि करें' : 'Confirm Password'}
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                minLength={4}
              />
            </div>
          </div>

          {error && <div className="error-box" style={{ marginBottom: '14px' }}>{error}</div>}

          <div className="auth-actions">
            <button type="submit" className="primary-btn" disabled={busy}>
              {busy
                ? 'Creating Account...'
                : language === 'te'
                  ? 'వాలంటీర్ ఖాతా సృష్టించండి'
                  : language === 'hi'
                    ? 'स्वयंसेवक खाता बनाएं'
                    : 'Create Volunteer Account'}
            </button>
          </div>
        </form>

        <div className="form-note" style={{ marginTop: '16px' }}>
          {language === 'te' ? 'ఇప్పటికే వాలంటీర్ ఖాతా ఉందా?' : language === 'hi' ? 'पहले से स्वयंसेवक खाता है?' : 'Already have a volunteer account?'}{' '}
          <Link to="/login/admin" style={{ fontWeight: 600, color: '#16a34a' }}>
            {language === 'te' ? 'ఇక్కడ లాగిన్ అవ్వండి' : language === 'hi' ? 'यहाँ लॉगिन करें' : 'Login here'}
          </Link>
        </div>
      </div>
    </div>
  )
}
