import type { AnalyticsUser } from './types'

const STORAGE_KEY = 'analytics_user'

export function normalizeAnalyticsUser(user?: AnalyticsUser | null): AnalyticsUser | undefined {
  if (!user) return undefined
  const entries = Object.entries(user).filter(
    ([, value]) => value !== undefined && value !== null && value !== ''
  )
  if (!entries.length) return undefined
  return Object.fromEntries(entries) as AnalyticsUser
}

export function loadAnalyticsUser(): AnalyticsUser | null {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return null
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AnalyticsUser
    return normalizeAnalyticsUser(parsed) ?? null
  } catch {
    return null
  }
}

export function saveAnalyticsUser(user: AnalyticsUser): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return
  }
  try {
    const normalized = normalizeAnalyticsUser(user)
    if (!normalized) {
      localStorage.removeItem(STORAGE_KEY)
      return
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
    document.dispatchEvent(new CustomEvent('analytics_user_updated', { detail: normalized }))
  } catch {
    // Storage might be full or disabled
  }
}

export function clearAnalyticsUser(): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return
  }
  try {
    localStorage.removeItem(STORAGE_KEY)
    document.dispatchEvent(new CustomEvent('analytics_user_updated', { detail: null }))
  } catch {
    // Ignore errors
  }
}

export function updateAnalyticsUser(updates: Partial<AnalyticsUser>): void {
  const current = loadAnalyticsUser()
  const merged = { ...(current ?? {}), ...updates }
  saveAnalyticsUser(merged)
}
