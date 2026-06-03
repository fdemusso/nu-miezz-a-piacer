import { Router } from 'express'
import { makeRideSummaryHandler } from './RideSummary.handler'
import type { Container } from '../../composition/types'
import { requireAuth } from '../../middleware/fakeAuth'

export function makeRideSummaryRouter(deps: Container['rideSummary']): Router {
  const router = Router()
  const handler = makeRideSummaryHandler(deps)

  router.get('/rides/:rideId/summary', requireAuth('customer'), async (req, res) => {
    try {
      const input = { rideId: req.params.rideId }
      const result = await handler(input)
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}
