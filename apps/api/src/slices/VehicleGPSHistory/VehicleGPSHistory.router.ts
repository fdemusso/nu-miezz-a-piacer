import { Router } from 'express'
import { makeVehicleGPSHistoryHandler } from './VehicleGPSHistory.handler'
import type { VehicleGPSHistoryRequest } from './VehicleGPSHistory.types'
import type { Container } from '../../composition/types'

export function makeVehicleGPSHistoryRouter(deps: Container['vehicleGPSHistory']): Router {
  const router = Router()
  const handler = makeVehicleGPSHistoryHandler(deps)

  router.get('/operator/vehicles/:vehicleId/gps-history', async (req, res) => {
    const input = req.query as unknown as VehicleGPSHistoryRequest
    const result = await handler(input)
    res.status(200).json(result)
  })

  return router
}
