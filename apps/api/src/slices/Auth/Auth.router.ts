/**
 * AUTH ROUTER — DEMO/sviluppo only.
 *
 * Endpoints:
 *   POST /api/auth/login      { email, password }         → { token, userId, role, name }
 *   POST /api/auth/register   { email, password, name }   → { token, userId, role, name }
 *   POST /api/auth/token      { role }  shortcut rapido   → { token, userId, role }
 *   GET  /api/auth/token/:role                            → { token, userId, role }
 *
 * NOTA DEMO: la password NON viene verificata né hashata.
 * In produzione: usare bcrypt + secret JWT reale.
 *
 * Utenti pre-caricati dal seed:
 *   customer@test.com / operator@test.com / admin@test.com  (qualsiasi password)
 */

import { Router } from 'express'
import type { IUserRepository, UserRole } from '@vsa/contracts'

// Shortcut per test rapidi senza passare email
const DEMO_USERS: Record<string, { userId: string; role: UserRole }> = {
  customer: { userId: 'u-customer-1', role: 'customer' },
  operator: { userId: 'u-operator-1', role: 'operator' },
  admin:    { userId: 'u-admin-1',    role: 'admin' },
}

/**
 * Costruisce un JWT fake: header+payload validi, firma fissa non verificata.
 * Il frontend (e fakeAuth.ts) decodifica solo il payload base64.
 */
function buildFakeJwt(userId: string, role: UserRole): string {
  const header  = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(JSON.stringify({ userId, role, iat: Math.floor(Date.now() / 1000) })).toString('base64url')
  return `${header}.${payload}.DEMO_SIGNATURE_NOT_VERIFIED`
}

export function makeAuthRouter(deps: { userRepo: IUserRepository }) {
  const router = Router()

  // ── POST /api/auth/login ──────────────────────────────────────────────────
  router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body as { email?: string; password?: string }
    if (!email || !password) {
      return res.status(400).json({ error: 'email e password obbligatorie' })
    }
    const user = await deps.userRepo.findByEmail(email)
    if (!user) {
      // Risposta volutamente generica per non rivelare l'esistenza dell'email
      return res.status(401).json({ error: 'Credenziali non valide' })
    }
    if (user.suspended) {
      return res.status(403).json({ error: 'Account sospeso' })
    }
    // DEMO: password ignorata — in produzione verificare l'hash
    const token = buildFakeJwt(user.id, user.role)
    return res.json({ token, userId: user.id, role: user.role, name: user.name })
  })

  // ── POST /api/auth/register ───────────────────────────────────────────────
  router.post('/auth/register', async (req, res) => {
    const { email, password, name } = req.body as { email?: string; password?: string; name?: string }
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'email, password e nome obbligatori' })
    }
    const existing = await deps.userRepo.findByEmail(email)
    if (existing) {
      return res.status(409).json({ error: 'Email già registrata' })
    }
    const newUser = {
      id: `u-${Date.now()}`,
      email: email.toLowerCase(),
      role: 'customer' as UserRole,
      name,
      suspended: false,
    }
    await deps.userRepo.save(newUser)
    const token = buildFakeJwt(newUser.id, newUser.role)
    return res.status(201).json({ token, userId: newUser.id, role: newUser.role, name: newUser.name })
  })

  // ── POST /api/auth/token  (shortcut per curl/Postman) ────────────────────
  router.post('/auth/token', (req, res) => {
    const { userId, role } = req.body as { userId?: string; role?: string }
    if (!userId && role && DEMO_USERS[role]) {
      const demo = DEMO_USERS[role]
      return res.json({ token: buildFakeJwt(demo.userId, demo.role), ...demo })
    }
    if (!userId || !role) {
      return res.status(400).json({ error: 'userId e role obbligatori' })
    }
    return res.json({ token: buildFakeJwt(userId, role as UserRole), userId, role })
  })

  // ── GET /api/auth/token/:role  (shortcut browser) ────────────────────────
  router.get('/auth/token/:role', (req, res) => {
    const demo = DEMO_USERS[req.params.role]
    if (!demo) return res.status(404).json({ error: 'Ruolo non riconosciuto' })
    return res.json({ token: buildFakeJwt(demo.userId, demo.role), ...demo })
  })

  return router
}
