import { Router } from 'express'
import { makeVehicleBatteryStatusHandler } from './VehicleBatteryStatus.handler'
import type { VehicleBatteryStatusRequest } from './VehicleBatteryStatus.types'
import type { Container } from '../../composition/types'

export function makeVehicleBatteryStatusRouter(deps: Container['vehicleBatteryStatus']): Router {
  const router = Router()
  const handler = makeVehicleBatteryStatusHandler(deps)

  router.get('/vehicles/:vehicleId/battery', async (req, res) => {
    try {
      const result = await handler({ vehicleId: req.params.vehicleId })
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}
