import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { prototypeLogin, signInWithRole, type UserRole } from '../services/authService'
import { supabaseConfigured } from '../lib/supabase'

export function LoginPage({ role }: { role: UserRole }) {
  const navigate = useNavigate()
  const { loginPrototype } = useAuth()
  const [identity, setIdentity] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setBusy(true)

    try {
      if (!supabaseConfigured) {
        const demoUser = prototypeLogin(identity, password, role)
        if (!demoUser) {
          throw new Error(role === 'ADMIN' ? 'Admin demo credentials are invalid.' : 'Farmer demo credentials are invalid.')
        }
        loginPrototype(demoUser)
        navigate(role === 'ADMIN' ? '/admin/dashboard' : '/farmer/community')
        return
      }

      const user = await signInWithRole(identity, password, role)
      navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/farmer/community')
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'Unable to sign in.'
      setError(message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <span className="section-kicker">{role === 'ADMIN' ? 'GRAM SAHAYAK & VOLUNTEER DESK' : 'SMART FARMING ASSISTANT'}</span>
        <h1>{role === 'ADMIN' ? 'Volunteer Login' : 'Farmer Login'}</h1>
        <p>{role === 'ADMIN' ? 'Access the field volunteer network, verify crop reports, and assist farmers.' : 'Join the community, ask notes, and track your farm updates.'}</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="identity">{role === 'ADMIN' ? 'Volunteer Email or ID' : 'Mobile or Email'}</label>
            <input id="identity" type="text" value={identity} onChange={(event) => setIdentity(event.target.value)} placeholder={role === 'ADMIN' ? 'admin@smartkrishi.com' : '9999999999'} required />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required />
          </div>

          {error && <div className="error-box">{error}</div>}

          <div className="auth-actions">
            <button type="submit" className="primary-btn" disabled={busy}>
              {busy ? 'Signing in...' : role === 'ADMIN' ? 'Login as Volunteer' : 'Login as Farmer'}
            </button>
          </div>
        </form>

        <div className="form-note">
          {role === 'ADMIN' ? (
            <span>Demo volunteer: admin@smartkrishi.com / Admin@123 (or admin@kisanai.demo / admin123)</span>
          ) : (
            <span>Demo farmer: 9999999999 / farmer123 (or demo / farmer123)</span>
          )}
        </div>

        <div className="auth-actions" style={{ marginTop: '12px' }}>
          {role === 'ADMIN' ? (
            <Link to="/volunteer/register" className="secondary-btn" style={{ textAlign: 'center' }}>
              Register as New Volunteer
            </Link>
          ) : (
            <Link to="/farmer/register" className="secondary-btn" style={{ textAlign: 'center' }}>
              Create Farmer Account
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
