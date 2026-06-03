import { Router } from 'express'
import { makeDefineSensitiveZoneHandler } from './DefineSensitiveZone.handler'
import type { Container } from '../../composition/types'
import { requireAuth } from '../../middleware/fakeAuth'

export function makeDefineSensitiveZoneRouter(deps: Container['defineSensitiveZone']): Router {
  const router = Router()
  const handler = makeDefineSensitiveZoneHandler(deps)

  router.post('/zones/sensitive', requireAuth('admin'), async (req, res) => {
    try {
      const result = await handler(req.body)
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}
