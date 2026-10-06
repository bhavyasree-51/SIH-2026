import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase'
import { getProfile } from '../services/profileService'
import { saveCurrentUser, signOut, type AuthUser, type UserRole } from '../services/authService'

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  loginPrototype: (user: AuthUser) => void
  refreshProfile: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async (authUser: { id: string; email?: string } | null) => {
    if (!authUser) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const profile = await getProfile(authUser.id)
      setUser({
        id: authUser.id,
        email: authUser.email || profile.email,
        name: profile.full_name,
        role: profile.role as UserRole,
        location: profile.district,
      })
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const savedUser = localStorage.getItem('smartkrishi_currentUser') ?? sessionStorage.getItem('kisanai-prototype-user')
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser) as AuthUser
        setUser(parsed)
        setLoading(false)
        return
      } catch {
        localStorage.removeItem('smartkrishi_currentUser')
        sessionStorage.removeItem('kisanai-prototype-user')
      }
    }

    if (!supabaseConfigured) {
      setLoading(false)
      return
    }

    void supabase.auth.getSession().then(({ data }) => load(data.session?.user ?? null))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      void load(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const loginPrototype = (nextUser: AuthUser) => {
    saveCurrentUser(nextUser)
    setUser(nextUser)
  }

  const refreshProfile = async () => {
    const savedUser = localStorage.getItem('smartkrishi_currentUser') ?? sessionStorage.getItem('kisanai-prototype-user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser) as AuthUser)
        return
      } catch {
        localStorage.removeItem('smartkrishi_currentUser')
      }
    }

    if (!supabaseConfigured) {
      setUser(null)
      return
    }

    const { data } = await supabase.auth.getUser()
    await load(data.user ? { id: data.user.id, email: data.user.email } : null)
  }

  const logout = async () => {
    saveCurrentUser(null)
    try {
      await signOut()
    } finally {
      setUser(null)
    }
  }

  return <AuthContext.Provider value={{ user, loading, loginPrototype, refreshProfile, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export function hasRole(user: AuthUser | null, role: UserRole) {
  return user?.role === role
}
