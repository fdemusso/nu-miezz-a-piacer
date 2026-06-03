import { Router } from 'express'
import { makeLowAvailabilityAlertHandler } from './LowAvailabilityAlert.handler'
import type { Container } from '../../composition/types'
import { requireAuth } from '../../middleware/fakeAuth'

export function makeLowAvailabilityAlertRouter(deps: Container['lowAvailabilityAlert']): Router {
  const router = Router()
  const handler = makeLowAvailabilityAlertHandler(deps)

  router.post('/fleet/low-availability-check', requireAuth('operator'), async (req, res) => {
    try {
      const result = await handler({})
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}
