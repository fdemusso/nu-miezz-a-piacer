import { Router } from 'express'
import { makeVehicleGPSHistoryHandler } from './VehicleGPSHistory.handler'
import type { VehicleGPSHistoryRequest } from './VehicleGPSHistory.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makeVehicleGPSHistoryHandler(container.vehicleGPSHistory)

router.get('/operator/vehicles/:vehicleId/gps-history', async (req, res) => {
  const input = req.query as unknown as VehicleGPSHistoryRequest
  const result = await handler(input)
  res.status(200).json(result)
})

export { router as vehicleGPSHistoryRouter }
