import { Router } from 'express'
import { makeMarkUrbanWarningZoneHandler } from './MarkUrbanWarningZone.handler'
import type { Container } from '../../composition/types'
import { requireAuth } from '../../middleware/fakeAuth'

export function makeMarkUrbanWarningZoneRouter(deps: Container['markUrbanWarningZone']): Router {
  const router = Router()
  const handler = makeMarkUrbanWarningZoneHandler(deps)

  router.post('/zones/warning', requireAuth('admin'), async (req, res) => {
    try {
      const result = await handler(req.body)
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}
