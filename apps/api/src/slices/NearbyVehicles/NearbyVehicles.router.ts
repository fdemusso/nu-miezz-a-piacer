import { Router } from 'express'
import { makeNearbyVehiclesHandler } from './NearbyVehicles.handler'
import type { NearbyVehiclesRequest } from './NearbyVehicles.types'
import type { IVehicleRepository } from '@vsa/contracts'

export function makeNearbyVehiclesRouter(deps: { vehicleRepo: IVehicleRepository }): Router {
  const router = Router()
  const handler = makeNearbyVehiclesHandler(deps)

  router.get('/vehicles/nearby', async (req, res) => {
    try {
      const input = req.query as unknown as NearbyVehiclesRequest
      const result = await handler(input)
      res.status(200).json(result)
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' })
    }
  })

  return router
}
