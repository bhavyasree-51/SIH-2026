import { supabase, supabaseConfigured } from '../lib/supabase'
import { getProfile } from './profileService'

export type UserRole = 'FARMER' | 'ADMIN'

export type AuthUser = {
  id: string
  email: string
  name: string
  role: UserRole
  location?: string
}

export type RegisteredFarmer = {
  id: string
  email: string
  password: string
  name: string
  phone: string
  district: string
  state: string
  language: 'en' | 'hi' | 'te'
  role: 'FARMER'
  createdAt: string
}

export const adminCredentials = {
  email: 'admin@smartkrishi.com',
  password: 'Admin@123',
  user: { id: 'admin-smartkrishi', email: 'admin@smartkrishi.com', name: 'Smart Krishi Admin', role: 'ADMIN' as const, location: 'Head Office' },
}

export type RegisteredVolunteer = {
  id: string
  email: string
  password: string
  name: string
  phone: string
  district: string
  state: string
  designation?: string
  role: 'ADMIN'
  createdAt: string
}

const STORAGE_KEYS = {
  farmers: 'smartkrishi_farmers',
  volunteers: 'smartkrishi_volunteers',
  currentUser: 'smartkrishi_currentUser',
}

function readVolunteers(): RegisteredVolunteer[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.volunteers)
    return raw ? (JSON.parse(raw) as RegisteredVolunteer[]) : []
  } catch {
    return []
  }
}

function writeVolunteers(volunteers: RegisteredVolunteer[]) {
  localStorage.setItem(STORAGE_KEYS.volunteers, JSON.stringify(volunteers))
}

export function getRegisteredVolunteers() {
  return readVolunteers()
}

export function registerVolunteerAccount(input: {
  name: string
  email: string
  password: string
  phone: string
  district: string
  state: string
  designation?: string
}) {
  const volunteers = readVolunteers()
  const normalizedEmail = input.email.trim().toLowerCase()
  const normalizedPhone = input.phone.trim()

  if (volunteers.some((v) => v.email.toLowerCase() === normalizedEmail || v.phone === normalizedPhone)) {
    throw new Error('A volunteer account with this email or mobile number already exists.')
  }

  const nextVolunteer: RegisteredVolunteer = {
    id: `volunteer-${Date.now()}`,
    email: normalizedEmail,
    password: input.password,
    name: input.name.trim(),
    phone: normalizedPhone,
    district: input.district.trim(),
    state: input.state.trim(),
    designation: input.designation || 'Gram Sahayak / Field Volunteer',
    role: 'ADMIN',
    createdAt: new Date().toISOString(),
  }

  volunteers.push(nextVolunteer)
  writeVolunteers(volunteers)

  // Persist to Supabase Database
  if (supabaseConfigured) {
    try {
      void supabase.from('profiles').upsert({
        id: nextVolunteer.id,
        full_name: nextVolunteer.name,
        email: nextVolunteer.email,
        mobile_number: nextVolunteer.phone,
        role: 'ADMIN',
        state: nextVolunteer.state,
        district: nextVolunteer.district,
        created_at: nextVolunteer.createdAt,
        updated_at: nextVolunteer.createdAt,
      })
    } catch {
      // ignore
    }
  }

  return nextVolunteer
}

function readFarmers(): RegisteredFarmer[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.farmers)
    return raw ? (JSON.parse(raw) as RegisteredFarmer[]) : []
  } catch {
    return []
  }
}

function writeFarmers(farmers: RegisteredFarmer[]) {
  localStorage.setItem(STORAGE_KEYS.farmers, JSON.stringify(farmers))
}

export function getRegisteredFarmers() {
  return readFarmers()
}

export function registerFarmerAccount(input: {
  name: string
  email: string
  password: string
  phone: string
  district: string
  state: string
  language?: 'en' | 'hi' | 'te'
}) {
  const farmers = readFarmers()
  const normalizedEmail = input.email.trim().toLowerCase()
  const normalizedPhone = input.phone.trim()

  if (farmers.some((farmer) => farmer.email.toLowerCase() === normalizedEmail || farmer.phone === normalizedPhone)) {
    throw new Error('An account with this email or mobile number already exists.')
  }

  const nextUser: RegisteredFarmer = {
    id: `farmer-${Date.now()}`,
    email: normalizedEmail,
    password: input.password,
    name: input.name.trim(),
    phone: normalizedPhone,
    district: input.district.trim(),
    state: input.state.trim(),
    language: input.language ?? 'en',
    role: 'FARMER',
    createdAt: new Date().toISOString(),
  }

  farmers.push(nextUser)
  writeFarmers(farmers)

  // Persist to Supabase Database
  if (supabaseConfigured) {
    try {
      void supabase.from('profiles').upsert({
        id: nextUser.id,
        full_name: nextUser.name,
        email: nextUser.email,
        mobile_number: nextUser.phone,
        role: 'FARMER',
        state: nextUser.state,
        district: nextUser.district,
        preferred_language: nextUser.language,
        created_at: nextUser.createdAt,
        updated_at: nextUser.createdAt,
      })
    } catch {
      // ignore
    }
  }

  return nextUser
}

export function prototypeLogin(identity: string, password: string, role: UserRole) {
  const value = identity.trim().toLowerCase()
  const pass = password.trim()

  if (role === 'ADMIN') {
    const adminEmails = [
      adminCredentials.email.toLowerCase(),
      'admin@kisanai.demo',
      'admin@kisanai.local',
      'admin@kisanai.com',
      'admin@smartkrishi.in',
      'admin',
      'administrator',
    ]
    const validPasswords = [adminCredentials.password, 'Admin@123', 'admin123', 'admin']
    
    if (adminEmails.includes(value) && validPasswords.includes(pass)) {
      return {
        id: 'admin-smartkrishi',
        email: value.includes('@') ? value : 'admin@smartkrishi.com',
        name: 'Smart Krishi Volunteer Admin',
        role: 'ADMIN' as const,
        location: 'Head Office',
      }
    }

    const volunteers = readVolunteers()
    const vol = volunteers.find((entry) => {
      const matchesEmail = entry.email.toLowerCase() === value
      const matchesPhone = entry.phone === value
      return (matchesEmail || matchesPhone) && entry.password === password
    })

    if (vol) {
      return {
        id: vol.id,
        email: vol.email,
        name: `${vol.name} (${vol.designation || 'Volunteer'})`,
        role: 'ADMIN' as const,
        location: `${vol.district}, ${vol.state}`,
      }
    }

    return null
  }

  const demoFarmerMatch =
    (value === '9999999999' ||
      value === 'demo.farmer@kisanai.local' ||
      value === 'farmer@smartkrishi.com' ||
      value === 'farmer@kisanai.demo' ||
      value === 'demo' ||
      value === 'demo farmer') &&
    (pass === 'farmer123' || pass === 'Farmer@123' || pass === 'farmer')
  if (demoFarmerMatch) {
    return {
      id: 'demo-farmer-kisanai',
      email: 'demo.farmer@kisanai.local',
      name: 'Ramesh Patel (Farmer)',
      role: 'FARMER' as const,
      location: 'Nalgonda',
    }
  }

  const farmers = readFarmers()
  const farmer = farmers.find((entry) => {
    const matchesEmail = entry.email.toLowerCase() === value
    const matchesPhone = entry.phone === value
    return (matchesEmail || matchesPhone) && entry.password === password
  })

  if (!farmer) return null

  return {
    id: farmer.id,
    email: farmer.email,
    name: farmer.name,
    role: 'FARMER' as const,
    location: farmer.district,
  }
}

export async function signInWithRole(identity: string, password: string, role: UserRole): Promise<AuthUser> {
  if (role === 'ADMIN') {
    const demo = prototypeLogin(identity, password, role)
    if (!demo) throw new Error('Invalid admin email or password.')
    return demo
  }

  const localUser = prototypeLogin(identity, password, role)
  if (localUser) return localUser

  if (!supabaseConfigured) {
    throw new Error('No registered farmer matched these credentials.')
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email: identity.trim(), password })
  if (error || !data.user) throw error ?? new Error('Unable to sign in')

  try {
    const profile = await getProfile(data.user.id)
    if (profile.role !== role) {
      await supabase.auth.signOut()
      throw new Error('wrong-role')
    }
    return { id: data.user.id, email: data.user.email || identity, name: profile.full_name, role, location: profile.district }
  } catch (reason) {
    if (reason instanceof Error && reason.message === 'wrong-role') throw reason
    return { id: data.user.id, email: data.user.email || identity, name: data.user.email || 'Farmer', role, location: 'District' }
  }
}

export function saveCurrentUser(user: AuthUser | null) {
  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.currentUser)
    sessionStorage.removeItem('kisanai-prototype-user')
    return
  }

  localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user))
  sessionStorage.setItem('kisanai-prototype-user', JSON.stringify(user))
}

export async function signOut() {
  if (supabaseConfigured) {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }
  sessionStorage.removeItem('kisanai-prototype-user')
  localStorage.removeItem('smartkrishi_currentUser')
}

export async function sendPasswordReset(email: string) {
  if (!supabaseConfigured) return true
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/login/farmer` })
  if (error) throw error
  return true
}
