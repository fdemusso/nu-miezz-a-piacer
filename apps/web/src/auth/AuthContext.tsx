/**
 * AuthContext — gestione sessione semplice per demo.
 *
 * Strategia:
 *   - Token + info utente salvati in localStorage (semplice, no cookie httpOnly).
 *   - In produzione: sostituire con httpOnly cookie + refresh token + verifica firma JWT.
 *
 * Come usare in altri componenti:
 *   const { user, login, register, logout } = useAuth()
 *   if (!user) redirect al login
 *   fetch('/api/...', { headers: { Authorization: `Bearer ${user.token}` } })
 */

import React, { createContext, useContext, useState, useCallback } from 'react'

// ── Tipi ──────────────────────────────────────────────────────────────────────

export interface AuthUser {
  token: string
  userId: string
  role: 'customer' | 'operator' | 'admin'
  name: string
}

interface AuthContextValue {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'nmap_auth'

function loadFromStorage(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadFromStorage)

  function persist(u: AuthUser | null) {
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    else localStorage.removeItem(STORAGE_KEY)
    setUser(u)
  }

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error((body as { error?: string }).error ?? 'Login fallito')
    }
    const data = await res.json() as AuthUser & { token: string }
    persist(data)
  }, [])

  const register = useCallback(async (email: string, password: string, name: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error((body as { error?: string }).error ?? 'Registrazione fallita')
    }
    const data = await res.json() as AuthUser & { token: string }
    persist(data)
  }, [])

  const logout = useCallback(() => persist(null), [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve essere usato dentro <AuthProvider>')
  return ctx
}
