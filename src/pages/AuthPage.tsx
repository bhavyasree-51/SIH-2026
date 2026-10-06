import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, LockKeyhole, Sprout } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { supabase, supabaseConfigured } from '../lib/supabase'
import { prototypeLogin, registerFarmerAccount, sendPasswordReset, signInWithRole } from '../services/authService'

type AuthMode = 'login' | 'register' | 'admin' | 'forgot'
const profileFields = [
  ['fullName', 'Full Name'],
  ['mobile', 'Mobile Number'],
  ['state', 'State'],
  ['district', 'District'],
  ['village', 'Village'],
  ['farmSize', 'Farm Size (acres)'],
  ['mainCrop', 'Main Crop'],
] as const

export function AuthPage({ mode }: { mode: AuthMode }) {
  const navigate = useNavigate()
  const { loginPrototype, refreshProfile } = useAuth()
  const [identity, setIdentity] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [form, setForm] = useState<Record<string, string>>({ preferredLanguage: 'en' })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const update = (key: string, value: string) =>
    setForm((current) => ({ ...current, [key]: value }))

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setMessage('')
    const role = mode === 'admin' ? 'ADMIN' : 'FARMER'

    if (!supabaseConfigured && (mode === 'login' || mode === 'admin')) {
      const demo = prototypeLogin(identity, password, role)
      if (demo) {
        loginPrototype(demo)
        navigate(role === 'ADMIN' ? '/admin/dashboard' : '/farmer/dashboard')
        return
      }
      setError('DEMO LOGIN details are incorrect.')
      return
    }

    if (!supabaseConfigured && mode === 'register') {
      try {
        if (password.length < 4) throw new Error('short-password')
        if (password !== confirm) throw new Error('password-mismatch')

        const registered = registerFarmerAccount({
          name: form.fullName || identity.split('@')[0],
          email: identity.includes('@') ? identity : `${identity}@kisanmitra.in`,
          phone: form.mobile || identity,
          password: password,
          district: form.district || 'Nalgonda',
          state: form.state || 'Telangana',
          language: (form.preferredLanguage as any) || 'en',
        })

        loginPrototype({
          id: registered.id,
          email: registered.email,
          name: registered.name,
          role: 'FARMER',
          location: `${registered.district}, ${registered.state}`,
        })
        navigate('/farmer/dashboard')
        return
      } catch (err: any) {
        setError(err?.message || 'Failed to create account.')
        return
      }
    }

    setBusy(true)
    try {
      if (mode === 'forgot') {
        await sendPasswordReset(identity)
        setMessage('Password reset instructions have been sent to your email.')
        return
      }

      if (mode === 'register') {
        if (password.length < 6) throw new Error('short-password')
        if (password !== confirm) throw new Error('password-mismatch')

        const { data, error: signupError } = await supabase.auth.signUp({
          email: identity.trim(),
          password,
          options: {
            data: {
              full_name: form.fullName,
              mobile_number: form.mobile,
              state: form.state,
              district: form.district,
              village: form.village,
              preferred_language: form.preferredLanguage,
              farm_size: Number(form.farmSize) || 2.5,
              main_crop: form.mainCrop || 'Tomato',
              role: 'FARMER',
            },
          },
        })

        if (signupError || !data.user || data.user.identities?.length === 0) {
          throw signupError || new Error('already registered')
        }

        if (!data.session) {
          setMessage('Account created. We sent a verification email to your email address.')
          return
        }

        await refreshProfile()
        navigate('/farmer/dashboard')
        return
      }

      const user = await signInWithRole(identity, password, role)
      navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/farmer/dashboard')
    } catch (reason) {
      const text = reason instanceof Error ? reason.message.toLowerCase() : ''
      setError(
        text === 'short-password'
          ? 'Password must be at least 6 characters.'
          : text === 'password-mismatch'
            ? 'Passwords do not match.'
            : text.includes('already') || text.includes('duplicate')
              ? 'This email is already registered. Please log in.'
              : text === 'wrong-role'
                ? `This account is not authorized for ${role === 'ADMIN' ? 'volunteer' : 'farmer'} access.`
                : mode === 'forgot'
                  ? 'Unable to send reset instructions. Please check your email and try again.'
                  : 'Unable to complete this request. Please check your details and try again.'
      )
    } finally {
      setBusy(false)
    }
  }

  const title =
    mode === 'register'
      ? 'Create Your KisanAI Account'
      : mode === 'admin'
        ? 'Volunteer Login'
        : mode === 'forgot'
          ? 'Reset your password'
          : 'Farmer Login'

  const submitLabel =
    mode === 'register'
      ? 'Create Farmer Account'
      : mode === 'admin'
        ? 'Login as Volunteer'
        : mode === 'forgot'
          ? 'Send Reset Instructions'
          : 'Login as Farmer'

  const identityLabel = mode === 'admin' || mode === 'forgot' ? 'Email' : 'Mobile Number or Email'

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <img src="/logo.png" alt="Kisan Mitra Logo" className="brand-logo-img" />
        <strong>Kisan<span>Mitra</span></strong>
      </div>
      <div className="auth-card">
        <span className="section-kicker">
          {mode === 'admin' ? 'VOLUNTEER & SAHAYAK ACCESS' : 'SMART FARMING ASSISTANT'}
        </span>
        <h1>{title}</h1>
        <p>
          {mode === 'register'
            ? 'Create your farmer profile to manage your KisanAI account.'
            : 'Continue securely with your KisanAI account.'}
        </p>

        {message ? (
          <div className="auth-success">
            <strong>{mode === 'forgot' ? 'Check your inbox' : 'Account Created'}</strong>
            <span>{message}</span>
            <Link to="/login/farmer">Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={submit}>
            {mode === 'register' &&
              profileFields.map(([key, label]) => (
                <label key={key}>
                  {label}
                  <input
                    required
                    value={form[key] || ''}
                    onChange={(event) => update(key, event.target.value)}
                    type={key === 'farmSize' ? 'number' : 'text'}
                    min={key === 'farmSize' ? '0' : undefined}
                  />
                </label>
              ))}

            {mode === 'register' && (
              <label>
                Preferred Language
                <select
                  value={form.preferredLanguage}
                  onChange={(event) => update('preferredLanguage', event.target.value)}
                >
                  <option value="en">English</option>
                  <option value="te">తెలుగు</option>
                  <option value="hi">हिंदी</option>
                </select>
              </label>
            )}

            <label>
              {identityLabel}
              <input
                required
                type={mode === 'admin' || mode === 'forgot' ? 'email' : 'text'}
                value={identity}
                onChange={(event) => setIdentity(event.target.value)}
              />
            </label>

            {mode !== 'forgot' && (
              <>
                <label>
                  Password
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    minLength={6}
                  />
                </label>
                {mode === 'register' && (
                  <label>
                    Confirm Password
                    <input
                      required
                      type="password"
                      value={confirm}
                      onChange={(event) => setConfirm(event.target.value)}
                      minLength={6}
                    />
                  </label>
                )}
              </>
            )}

            {error && <div className="auth-error">{error}</div>}

            <button className="auth-submit" type="submit" disabled={busy}>
              <LockKeyhole size={16} /> {busy ? 'Please wait...' : submitLabel} <ArrowRight size={16} />
            </button>
          </form>
        )}

        <div className="auth-switch">
          {mode === 'login' && (
            <>
              <Link to="/farmer/register">Create farmer account</Link>
              <Link to="/login/volunteer">Volunteer login</Link>
            </>
          )}
          {mode === 'admin' && (
            <>
              <Link to="/volunteer/register">Register as volunteer</Link>
              <Link to="/login/farmer">Farmer login</Link>
            </>
          )}
          {mode === 'register' && <Link to="/login/farmer">Already registered? Login</Link>}
          {mode === 'forgot' && <Link to="/login/farmer">Back to login</Link>}
        </div>
      </div>
    </div>
  )
}
