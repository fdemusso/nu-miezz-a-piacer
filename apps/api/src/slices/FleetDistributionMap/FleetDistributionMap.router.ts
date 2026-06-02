import { Router } from 'express'
import { makeFleetDistributionMapHandler } from './FleetDistributionMap.handler'
import type { FleetDistributionMapRequest } from './FleetDistributionMap.types'
import type { Container } from '../../composition/types'

export function makeFleetDistributionMapRouter(deps: Container['fleetDistributionMap']): Router {
  const router = Router()
  const handler = makeFleetDistributionMapHandler(deps)

  router.get('/operator/fleet/map', async (req, res) => {
    const input = req.query as unknown as FleetDistributionMapRequest
    const result = await handler(input)
    res.status(200).json(result)
  })

  return router
}
