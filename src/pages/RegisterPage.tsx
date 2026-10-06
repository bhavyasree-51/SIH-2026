import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useI18n } from '../i18n/I18nProvider'
import { registerFarmerAccount } from '../services/authService'

export function RegisterPage() {
  const navigate = useNavigate()
  const { loginPrototype } = useAuth()
  const { language } = useI18n()
  const [fullName, setFullName] = useState('')
  const [mobile, setMobile] = useState('')
  const [district, setDistrict] = useState('')
  const [state, setState] = useState('Telangana')
  const [crop, setCrop] = useState('Tomato')
  const [farmSize, setFarmSize] = useState('2.5')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    const cleanName = fullName.trim()
    const cleanMobile = mobile.trim()
    const cleanDistrict = district.trim()
    const cleanState = state.trim()
    const cleanPassword = password.trim()

    if (!cleanName || !cleanMobile || !cleanDistrict || !cleanPassword) {
      setError(language === 'te' ? 'దయచేసి అన్ని వివరాలను పూరించండి.' : language === 'hi' ? 'कृपया सभी फ़ील्ड भरें।' : 'Please complete all required fields.')
      return
    }

    if (cleanMobile.length < 10) {
      setError(language === 'te' ? 'చెల్లుబాటు అయ్యే 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి.' : language === 'hi' ? 'कृपया मान्य 10 अंकों का मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.')
      return
    }

    setBusy(true)
    try {
      // 1. Register farmer into central storage database
      const newFarmer = registerFarmerAccount({
        name: cleanName,
        email: `${cleanMobile}@kisanmitra.in`,
        phone: cleanMobile,
        password: cleanPassword,
        district: cleanDistrict,
        state: cleanState || 'Telangana',
        language: language || 'te',
      })

      // 2. Initialize farmer's farm plot in smartkrishi_farms
      const existingFarmsRaw = localStorage.getItem('smartkrishi_farms')
      let existingFarms: any[] = []
      try {
        existingFarms = existingFarmsRaw ? JSON.parse(existingFarmsRaw) : []
      } catch {
        existingFarms = []
      }

      const initialFarm = {
        id: `farm-${Date.now()}`,
        name: `${cleanName}'s Farm Plot`,
        location: `${cleanDistrict}, ${cleanState}`,
        acreage: Number(farmSize) || 2.5,
        soil: 'Loamy (pH 6.8)',
        crops: [
          {
            id: `crop-${Date.now()}`,
            name: crop || 'Tomato',
            sowingDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            expectedHarvestDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          },
        ],
      }
      localStorage.setItem('smartkrishi_farms', JSON.stringify([initialFarm, ...existingFarms]))

      // 3. Log in the newly registered farmer
      const user = {
        id: newFarmer.id,
        email: newFarmer.email,
        name: newFarmer.name,
        role: 'FARMER' as const,
        location: `${newFarmer.district}, ${newFarmer.state}`,
      }
      loginPrototype(user)

      // 4. Navigate directly to farmer dashboard
      navigate('/farmer/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Failed to create account. Please check your details.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <span className="section-kicker">
          {language === 'te' ? 'రైతు నమోదు' : language === 'hi' ? 'किसान पंजीकरण' : 'CREATE FARMER ACCOUNT'}
        </span>
        <h1>
          {language === 'te' ? 'కొత్త రైతు ఖాతా తెరవండి' : language === 'hi' ? 'नया किसान खाता बनाएं' : 'Register as a Farmer'}
        </h1>
        <p>
          {language === 'te'
            ? 'మీ పొలం సమాచారం, వాతావరణం మరియు ఉచిత AI సలహాలు పొందడానికి నమోదు చేసుకోండి.'
            : language === 'hi'
              ? 'खेत की जानकारी, मौसम और मुफ्त AI कृषि सलाह पाने के लिए पंजीकरण करें।'
              : 'Set up your farm profile to access precision agronomy, disease detection, and voice assistance.'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="fullName">
              {language === 'te' ? 'రైతు పూర్తి పేరు' : language === 'hi' ? 'किसान का पूरा नाम' : 'Full Name'} *
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Ramesh Patel"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="mobile">
              {language === 'te' ? 'మొబైల్ నంబర్' : language === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'} *
            </label>
            <input
              id="mobile"
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="e.g. 9876543210"
              maxLength={10}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="field">
              <label htmlFor="district">
                {language === 'te' ? 'జిల్లా' : language === 'hi' ? 'जिला' : 'District'} *
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="field">
              <label htmlFor="crop">
                {language === 'te' ? 'ప్రధాన పంట' : language === 'hi' ? 'मुख्य फसल' : 'Main Crop'}
              </label>
              <select id="crop" value={crop} onChange={(e) => setCrop(e.target.value)}>
                <option value="Tomato">Tomato (టమాటా / टमाटर)</option>
                <option value="Chilli">Chilli (మిరప / मिर्च)</option>
                <option value="Paddy (Rice)">Paddy / Rice (వరి / धान)</option>
                <option value="Cotton">Cotton (పత్తి / कपास)</option>
                <option value="Potato">Potato (బంగాళాదుంప / आलू)</option>
                <option value="Maize (Corn)">Maize / Corn (మొక్కజొన్న / मक्का)</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="farmSize">
                {language === 'te' ? 'పొలం విస్తీర్ణం (ఎకరాలు)' : language === 'hi' ? 'जमीन (एकड़)' : 'Acreage'}
              </label>
              <input
                id="farmSize"
                type="number"
                step="0.5"
                min="0.5"
                value={farmSize}
                onChange={(e) => setFarmSize(e.target.value)}
                placeholder="2.5"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="password">
              {language === 'te' ? 'పాస్‌వర్డ్' : language === 'hi' ? 'पासवर्ड' : 'Password'} *
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              minLength={4}
              required
            />
          </div>

          {error && <div className="error-box" style={{ marginBottom: '14px' }}>{error}</div>}

          <div className="auth-actions">
            <button type="submit" className="primary-btn" disabled={busy}>
              {busy
                ? 'Creating Account...'
                : language === 'te'
                  ? 'ఖాతా సృష్టించండి'
                  : language === 'hi'
                    ? 'खाता बनाएं'
                    : 'Create Farmer Account'}
            </button>
          </div>
        </form>

        <div className="form-note">
          {language === 'te' ? 'ఇప్పటికే ఖాతా ఉందా?' : language === 'hi' ? 'पहले से खाता है?' : 'Already registered?'}{' '}
          <Link to="/farmer/login">{language === 'te' ? 'ఇక్కడ లాగిన్ అవ్వండి' : language === 'hi' ? 'यहाँ लॉगिन करें' : 'Login here'}</Link>
        </div>
      </div>
    </div>
  )
}
