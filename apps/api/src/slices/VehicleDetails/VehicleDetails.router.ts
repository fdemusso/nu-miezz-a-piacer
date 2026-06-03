import { Router } from 'express'
import { makeVehicleDetailsHandler } from './VehicleDetails.handler'
import type { VehicleDetailsRequest } from './VehicleDetails.types'
import type { Container } from '../../composition/types'

export function makeVehicleDetailsRouter(deps: Container['vehicleDetails']): Router {
  const router = Router()
  const handler = makeVehicleDetailsHandler(deps)

  router.get('/vehicles/:vehicleId', async (req, res) => {
    try {
      const result = await handler({ vehicleId: req.params.vehicleId })
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}
