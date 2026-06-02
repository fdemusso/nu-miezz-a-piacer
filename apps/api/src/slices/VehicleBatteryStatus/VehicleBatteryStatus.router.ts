import { Router } from 'express'
import { makeVehicleBatteryStatusHandler } from './VehicleBatteryStatus.handler'
import type { VehicleBatteryStatusRequest } from './VehicleBatteryStatus.types'
import type { Container } from '../../composition/types'

export function makeVehicleBatteryStatusRouter(deps: Container['vehicleBatteryStatus']): Router {
  const router = Router()
  const handler = makeVehicleBatteryStatusHandler(deps)

  router.get('/vehicles/:vehicleId/battery', async (req, res) => {
    const input = req.query as unknown as VehicleBatteryStatusRequest
    const result = await handler(input)
    res.status(200).json(result)
  })

  return router
}
