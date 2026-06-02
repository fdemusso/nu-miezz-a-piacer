import { Router } from 'express'
import { makeVehicleDetailsHandler } from './VehicleDetails.handler'
import type { VehicleDetailsRequest } from './VehicleDetails.types'
import type { Container } from '../../composition/types'

export function makeVehicleDetailsRouter(deps: Container['vehicleDetails']): Router {
  const router = Router()
  const handler = makeVehicleDetailsHandler(deps)

  router.get('/vehicles/:vehicleId', async (req, res) => {
    const input = req.query as unknown as VehicleDetailsRequest
    const result = await handler(input)
    res.status(200).json(result)
  })

  return router
}
