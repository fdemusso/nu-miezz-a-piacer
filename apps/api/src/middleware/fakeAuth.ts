/**
 * FAKE JWT MIDDLEWARE — solo per demo/sviluppo.
 *
 * NON verifica la firma del token: decodifica solo il payload base64.
 * In produzione sostituire con `jsonwebtoken.verify(token, SECRET)`.
 *
 * Come usarlo:
 *   router.get('/my-route', requireAuth(), handler)
 *   router.get('/admin-only', requireAuth('admin'), handler)
 *
 * Come generare un token di test:
 *   POST /api/auth/token  { "userId": "u-customer-1", "role": "customer" }
 */

import type { Request, Response, NextFunction } from 'express'
import type { UserRole } from '@vsa/contracts'

export interface AuthPayload {
  userId: string
  role: UserRole
}

// Estende Express.Request con il campo user
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload
    }
  }
}

/**
 * Decodifica un JWT SENZA verificare la firma.
 * Restituisce il payload se il formato è valido, null altrimenti.
 */
function decodePayload(token: string): AuthPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    // Il payload è la seconda parte, codificata in base64url
    const json = Buffer.from(parts[1], 'base64url').toString('utf8')
    const data = JSON.parse(json)
    if (typeof data.userId !== 'string' || typeof data.role !== 'string') return null
    return { userId: data.userId, role: data.role as UserRole }
  } catch {
    return null
  }
}

/**
 * Middleware di autenticazione fake.
 * Se `requiredRole` è specificato, blocca con 403 se il ruolo non corrisponde.
 */
export function requireAuth(requiredRole?: UserRole) {
  return function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const header = req.headers['authorization'] ?? ''

    // Supporta anche X-User-Id plain per chiamate rapide da curl/Postman
    if (!header && req.headers['x-user-id']) {
      req.user = {
        userId: req.headers['x-user-id'] as string,
        role: (req.headers['x-user-role'] as UserRole) ?? 'customer',
      }
      return next()
    }

    if (!header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' })
    }

    const token = header.slice(7)
    const payload = decodePayload(token)
    if (!payload) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    if (requiredRole && payload.role !== requiredRole) {
      return res.status(403).json({ error: `Role '${requiredRole}' required` })
    }

    req.user = payload
    next()
  }
}
