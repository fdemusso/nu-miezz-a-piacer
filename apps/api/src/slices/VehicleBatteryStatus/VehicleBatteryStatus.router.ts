import { Router } from 'express'
import { makeVehicleBatteryStatusHandler } from './VehicleBatteryStatus.handler'
import type { VehicleBatteryStatusRequest } from './VehicleBatteryStatus.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makeVehicleBatteryStatusHandler(container.vehicleBatteryStatus)

router.get('/vehicles/:vehicleId/battery', async (req, res) => {
  const input = req.query as unknown as VehicleBatteryStatusRequest
  const result = await handler(input)
  res.status(200).json(result)
})

export { router as vehicleBatteryStatusRouter }
