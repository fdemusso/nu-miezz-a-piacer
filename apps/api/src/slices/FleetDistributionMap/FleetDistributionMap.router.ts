import { Router } from 'express'
import { makeFleetDistributionMapHandler } from './FleetDistributionMap.handler'
import type { Container } from '../../composition/types'
import { requireAuth } from '../../middleware/fakeAuth'

export function makeFleetDistributionMapRouter(deps: Container['fleetDistributionMap']): Router {
  const router = Router()
  const handler = makeFleetDistributionMapHandler(deps)

  router.get('/fleet/distribution', requireAuth('operator'), async (req, res) => {
    try {
      const result = await handler({})
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}
