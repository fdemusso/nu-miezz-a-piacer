import { Router } from 'express'
import { makeEndRideHandler } from './EndRide.handler'
import type { Container } from '../../composition/types'
import { requireAuth } from '../../middleware/fakeAuth'

export function makeEndRideRouter(deps: Container['endRide']): Router {
  const router = Router()
  const handler = makeEndRideHandler(deps)

  router.post('/rides/end', requireAuth('customer'), async (req, res) => {
    try {
      const input = {
        userId: req.user!.userId,
        endLat: req.body.endLat,
        endLng: req.body.endLng,
      }
      const result = await handler(input)
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}
