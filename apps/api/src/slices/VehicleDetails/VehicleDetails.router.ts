import { Router } from 'express'
import { makeVehicleDetailsHandler } from './VehicleDetails.handler'
import type { VehicleDetailsRequest } from './VehicleDetails.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makeVehicleDetailsHandler(container.vehicleDetails)

router.get('/vehicles/:vehicleId', async (req, res) => {
  const input = req.query as unknown as VehicleDetailsRequest
  const result = await handler(input)
  res.status(200).json(result)
})

export { router as vehicleDetailsRouter }
