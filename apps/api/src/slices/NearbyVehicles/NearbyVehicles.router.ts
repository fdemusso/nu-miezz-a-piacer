import { Router } from 'express'
import { makeNearbyVehiclesHandler } from './NearbyVehicles.handler'
import type { NearbyVehiclesRequest } from './NearbyVehicles.types'
import type { Container } from '../../composition/types'

export function makeNearbyVehiclesRouter(deps: Container['nearbyVehicles']): Router {
  const router = Router()
  const handler = makeNearbyVehiclesHandler(deps)

  router.get('/vehicles/nearby', async (req, res) => {
    const input = req.query as unknown as NearbyVehiclesRequest
    const result = await handler(input)
    res.status(200).json(result)
  })

  return router
}
