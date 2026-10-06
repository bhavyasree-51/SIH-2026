import { supabase, supabaseConfigured } from '../lib/supabase'
import type { UserRole } from './authService'

export type FarmerProfile = {
  id: string
  full_name: string
  email: string
  mobile_number: string
  role: UserRole | 'FARMER' | 'ADMIN'
  state: string
  district: string
  village: string
  preferred_language: 'en' | 'hi' | 'te'
  farm_size: number
  main_crop: string
  created_at?: string
  updated_at?: string
}

const PROFILE_STORAGE_PREFIX = 'smartkrishi_profile_'

function getStoredProfile(userId: string): FarmerProfile | null {
  try {
    const raw = localStorage.getItem(`${PROFILE_STORAGE_PREFIX}${userId}`) || localStorage.getItem('smartkrishi_profile_default')
    if (raw) {
      return JSON.parse(raw) as FarmerProfile
    }
  } catch {
    // ignore
  }
  return null
}

function saveStoredProfile(userId: string, profile: FarmerProfile) {
  try {
    localStorage.setItem(`${PROFILE_STORAGE_PREFIX}${userId}`, JSON.stringify(profile))
    localStorage.setItem('smartkrishi_profile_default', JSON.stringify(profile))
  } catch {
    // ignore
  }
}

export function getDefaultDemoProfile(userId = 'demo-farmer-1', email = 'farmer@smartkrishi.demo', name = 'Ramesh Patel'): FarmerProfile {
  return {
    id: userId,
    full_name: name || 'Ramesh Patel',
    email: email || 'farmer@smartkrishi.demo',
    mobile_number: '9876543210',
    role: 'FARMER',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    village: 'Pedakakani',
    preferred_language: 'te',
    farm_size: 4.5,
    main_crop: 'Tomato',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export async function getProfile(userId: string): Promise<FarmerProfile> {
  // 1. Try Supabase if configured
  if (supabaseConfigured) {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
      if (!error && data) {
        const profile = data as FarmerProfile
        saveStoredProfile(userId, profile)
        return profile
      }
    } catch {
      // fallback to local storage
    }
  }

  // 2. Try LocalStorage
  const stored = getStoredProfile(userId)
  if (stored) {
    return stored
  }

  // 3. Check current user in localStorage for context
  try {
    const savedUserRaw = localStorage.getItem('smartkrishi_currentUser') || sessionStorage.getItem('kisanai-prototype-user')
    if (savedUserRaw) {
      const u = JSON.parse(savedUserRaw)
      const defaultProfile = getDefaultDemoProfile(userId, u.email, u.name)
      if (u.location) defaultProfile.district = u.location
      if (u.role) defaultProfile.role = u.role
      saveStoredProfile(userId, defaultProfile)
      return defaultProfile
    }
  } catch {
    // ignore
  }

  const fallback = getDefaultDemoProfile(userId)
  saveStoredProfile(userId, fallback)
  return fallback
}

export async function createFarmerProfile(profile: Omit<FarmerProfile, 'created_at' | 'updated_at'>) {
  const fullProfile: FarmerProfile = {
    ...profile,
    role: 'FARMER',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  saveStoredProfile(profile.id, fullProfile)

  if (supabaseConfigured) {
    try {
      await supabase.from('profiles').insert(fullProfile)
    } catch {
      // ignore
    }
  }
}

export async function updateFarmerProfile(
  userId: string,
  updates: Partial<Pick<FarmerProfile, 'full_name' | 'mobile_number' | 'state' | 'district' | 'village' | 'preferred_language' | 'farm_size' | 'main_crop'>>
): Promise<FarmerProfile> {
  const existing = await getProfile(userId)
  const merged: FarmerProfile = {
    ...existing,
    ...updates,
    updated_at: new Date().toISOString(),
  }

  saveStoredProfile(userId, merged)

  // Update current user cache as well
  try {
    const savedUserRaw = localStorage.getItem('smartkrishi_currentUser')
    if (savedUserRaw) {
      const u = JSON.parse(savedUserRaw)
      localStorage.setItem(
        'smartkrishi_currentUser',
        JSON.stringify({
          ...u,
          name: merged.full_name || u.name,
          location: merged.district || u.location,
        })
      )
    }
  } catch {
    // ignore
  }

  if (supabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single()
      if (!error && data) {
        return data as FarmerProfile
      }
    } catch {
      // ignore
    }
  }

  return merged
}
