import { useEffect, useState } from 'react'
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Globe2,
  Languages,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Sprout,
  User,
  UserCheck,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useI18n } from '../i18n/I18nProvider'
import { getProfile, updateFarmerProfile, type FarmerProfile } from '../services/profileService'

export function FarmerProfilePage() {
  const { user, refreshProfile } = useAuth()
  const { language, setLanguage } = useI18n()
  const [profile, setProfile] = useState<FarmerProfile | null>(null)
  const [form, setForm] = useState<{
    full_name: string
    mobile_number: string
    state: string
    district: string
    village: string
    preferred_language: 'en' | 'hi' | 'te'
    farm_size: string
    main_crop: string
  }>({
    full_name: '',
    mobile_number: '',
    state: '',
    district: '',
    village: '',
    preferred_language: (language as 'en' | 'hi' | 'te') || 'te',
    farm_size: '4.5',
    main_crop: 'Tomato',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userId = user?.id || 'demo-farmer-1'
    getProfile(userId)
      .then((data) => {
        setProfile(data)
        setForm({
          full_name: data.full_name || '',
          mobile_number: data.mobile_number || '',
          state: data.state || '',
          district: data.district || '',
          village: data.village || '',
          preferred_language: data.preferred_language || 'te',
          farm_size: String(data.farm_size || '4.5'),
          main_crop: data.main_crop || 'Tomato',
        })
      })
      .catch((err) => {
        setError('Could not load profile. Using offline defaults.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [user])

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')

    const userId = user?.id || 'demo-farmer-1'
    try {
      const updated = await updateFarmerProfile(userId, {
        full_name: form.full_name,
        mobile_number: form.mobile_number,
        state: form.state,
        district: form.district,
        village: form.village,
        preferred_language: form.preferred_language,
        farm_size: parseFloat(form.farm_size) || 0,
        main_crop: form.main_crop,
      })

      setProfile(updated)
      if (form.preferred_language) {
        setLanguage(form.preferred_language)
      }
      await refreshProfile()
      setMessage('Your farmer profile has been saved successfully!')
      setTimeout(() => setMessage(''), 4500)
    } catch {
      setError('Unable to update profile. Please check your network and try again.')
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="card" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <div className="voice-orb orb-processing" style={{ width: 60, height: 60, margin: '0 auto 16px' }} />
          <h3>Loading your farmer profile...</h3>
          <p className="helper-text">Retrieving farm account details securely.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      {/* Header Banner */}
      <div className="module-header profile-banner">
        <div className="profile-user-summary">
          <div className="profile-avatar-large">
            <User size={36} />
          </div>
          <div>
            <div className="profile-badges-row">
              <span className="section-kicker">KISANAI VERIFIED FARMER</span>
              <span className="pill status-pill">
                <ShieldCheck size={13} style={{ color: 'var(--primary)' }} /> Verified Account
              </span>
            </div>
            <h1>{profile?.full_name || 'Farmer Account'}</h1>
            <p className="profile-subtitle">
              <MapPin size={14} style={{ display: 'inline', marginRight: 4 }} />
              {profile?.village ? `${profile.village}, ` : ''}
              {profile?.district ? `${profile.district}, ` : ''}
              {profile?.state || 'India'}
            </p>
          </div>
        </div>

        <div className="profile-stats-chips">
          <div className="stat-chip">
            <Sprout size={16} style={{ color: 'var(--primary)' }} />
            <div>
              <small>Primary Crop</small>
              <strong>{profile?.main_crop || 'Tomato'}</strong>
            </div>
          </div>
          <div className="stat-chip">
            <Building2 size={16} style={{ color: '#0e6ae4' }} />
            <div>
              <small>Farm Size</small>
              <strong>{profile?.farm_size || '4.5'} Acres</strong>
            </div>
          </div>
          <div className="stat-chip">
            <Languages size={16} style={{ color: '#e44d5e' }} />
            <div>
              <small>Language</small>
              <strong>
                {profile?.preferred_language === 'te'
                  ? 'తెలుగు'
                  : profile?.preferred_language === 'hi'
                    ? 'हिंदी'
                    : 'English'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Form */}
      <form className="profile-form-card" onSubmit={handleSave}>
        {message && (
          <div className="profile-success">
            <CheckCircle2 size={18} />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="auth-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Section 1: Personal Details */}
        <div className="form-section">
          <div className="form-section-title">
            <UserCheck size={18} style={{ color: 'var(--primary)' }} />
            <h3>Personal Information</h3>
          </div>
          <div className="profile-grid">
            <label>
              Full Name *
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => updateField('full_name', e.target.value)}
                placeholder="e.g. Ramesh Patel"
                required
              />
            </label>
            <label>
              Email Address
              <input
                type="email"
                value={profile?.email || 'farmer@smartkrishi.demo'}
                disabled
                title="Email is linked to your login identity"
              />
            </label>
            <label>
              Mobile Number *
              <div className="input-with-icon">
                <Phone size={15} className="input-icon" />
                <input
                  type="tel"
                  value={form.mobile_number}
                  onChange={(e) => updateField('mobile_number', e.target.value)}
                  placeholder="e.g. 9876543210"
                  required
                />
              </div>
            </label>
          </div>
        </div>

        <hr className="form-divider" />

        {/* Section 2: Farm Location & Boundaries */}
        <div className="form-section">
          <div className="form-section-title">
            <MapPin size={18} style={{ color: 'var(--primary)' }} />
            <h3>Farm Location</h3>
          </div>
          <div className="profile-grid">
            <label>
              State *
              <input
                type="text"
                value={form.state}
                onChange={(e) => updateField('state', e.target.value)}
                placeholder="e.g. Andhra Pradesh / Maharashtra"
                required
              />
            </label>
            <label>
              District *
              <input
                type="text"
                value={form.district}
                onChange={(e) => updateField('district', e.target.value)}
                placeholder="e.g. Guntur / Nashik"
                required
              />
            </label>
            <label>
              Village / Mandal *
              <input
                type="text"
                value={form.village}
                onChange={(e) => updateField('village', e.target.value)}
                placeholder="e.g. Pedakakani"
                required
              />
            </label>
          </div>
        </div>

        <hr className="form-divider" />

        {/* Section 3: Agricultural Details */}
        <div className="form-section">
          <div className="form-section-title">
            <Sprout size={18} style={{ color: 'var(--primary)' }} />
            <h3>Agricultural Details</h3>
          </div>
          <div className="profile-grid">
            <label>
              Farm Size (Acres) *
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={form.farm_size}
                onChange={(e) => updateField('farm_size', e.target.value)}
                placeholder="e.g. 4.5"
                required
              />
            </label>
            <label>
              Primary Crop *
              <select
                value={form.main_crop}
                onChange={(e) => updateField('main_crop', e.target.value)}
              >
                <option value="Tomato">🍅 Tomato</option>
                <option value="Chilli">🌶️ Chilli</option>
                <option value="Cotton">🌱 Cotton</option>
                <option value="Rice">🌾 Rice / Paddy</option>
                <option value="Maize">🌽 Maize</option>
                <option value="Potato">🥔 Potato</option>
                <option value="Groundnut">🥜 Groundnut</option>
                <option value="Soybean">🌿 Soybean</option>
                <option value="Sugarcane">🎋 Sugarcane</option>
              </select>
            </label>
            <label>
              Preferred AI Voice Language *
              <div className="input-with-icon">
                <Globe2 size={15} className="input-icon" />
                <select
                  value={form.preferred_language}
                  onChange={(e) =>
                    updateField('preferred_language', e.target.value as 'en' | 'hi' | 'te')
                  }
                >
                  <option value="en">🇬🇧 English</option>
                  <option value="hi">🇮🇳 हिंदी (Hindi)</option>
                  <option value="te">🇮🇳 తెలుగు (Telugu)</option>
                </select>
              </div>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions-bar">
          <button className="primary-btn save-btn" disabled={busy} type="submit">
            <Save size={16} />
            <span>{busy ? 'Saving Changes...' : 'Save Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
