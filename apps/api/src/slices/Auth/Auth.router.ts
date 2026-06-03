/**
 * FAKE AUTH ENDPOINT — solo per demo/sviluppo.
 *
 * POST /api/auth/token
 * Body: { "userId": "u-customer-1", "role": "customer" }
 *
 * Genera un JWT con firma FALSA (secret = "demo").
 * Non usare mai in produzione.
 */

import { Router } from 'express'
import type { UserRole } from '@vsa/contracts'

// Utenti pre-caricati dal seed — comodi per la demo
const DEMO_USERS: Record<string, { userId: string; role: UserRole }> = {
  customer: { userId: 'u-customer-1', role: 'customer' },
  operator: { userId: 'u-operator-1', role: 'operator' },
  admin:    { userId: 'u-admin-1',    role: 'admin' },
}

function buildFakeJwt(userId: string, role: UserRole): string {
  // Header e payload sono JSON base64url legittimi; la firma è un hash fisso.
  // Un vero JWT avrebbe HMAC-SHA256(header.payload, SECRET) come terza parte.
  const header  = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(JSON.stringify({ userId, role, iat: Math.floor(Date.now() / 1000) })).toString('base64url')
  const fakeSignature = 'DEMO_SIGNATURE_NOT_VERIFIED'
  return `${header}.${payload}.${fakeSignature}`
}

export const authRouter = Router()

authRouter.post('/auth/token', (req, res) => {
  const { userId, role } = req.body as { userId?: string; role?: string }

  // Scorciatoia: se passi solo il ruolo, restituisce l'utente seed corrispondente
  if (!userId && role && DEMO_USERS[role]) {
    const demo = DEMO_USERS[role]
    return res.json({ token: buildFakeJwt(demo.userId, demo.role), ...demo })
  }

  if (!userId || !role) {
    return res.status(400).json({ error: 'userId e role sono obbligatori' })
  }

  const token = buildFakeJwt(userId, role as UserRole)
  res.json({ token, userId, role })
})

// Scorciatoia GET per il browser — es. /api/auth/token/customer
authRouter.get('/auth/token/:role', (req, res) => {
  const demo = DEMO_USERS[req.params.role]
  if (!demo) return res.status(404).json({ error: 'Ruolo non riconosciuto' })
  res.json({ token: buildFakeJwt(demo.userId, demo.role), ...demo })
})
