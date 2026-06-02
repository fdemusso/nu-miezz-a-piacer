import { Router } from 'express'
import { makeRemoteLockVehicleHandler } from './RemoteLockVehicle.handler'
import type { RemoteLockVehicleRequest } from './RemoteLockVehicle.types'
import type { Container } from '../../composition/types'

export function makeRemoteLockVehicleRouter(deps: Container['remoteLockVehicle']): Router {
  const router = Router()
  const handler = makeRemoteLockVehicleHandler(deps)

  router.post('/operator/vehicles/:vehicleId/lock', async (req, res) => {
    const input = req.body as unknown as RemoteLockVehicleRequest
    const result = await handler(input)
    res.status(201).json(result)
  })

  return router
}
