import { Router } from 'express'
import { makeUnlockVehicleHandler } from './UnlockVehicle.handler'
import type { UnlockVehicleRequest } from './UnlockVehicle.types'
import type { Container } from '../../composition/types'

export function makeUnlockVehicleRouter(deps: Container['unlockVehicle']): Router {
  const router = Router()
  const handler = makeUnlockVehicleHandler(deps)

  router.post('/vehicles/:vehicleId/unlock', async (req, res) => {
    const input = req.body as unknown as UnlockVehicleRequest
    const result = await handler(input)
    res.status(201).json(result)
  })

  return router
}
