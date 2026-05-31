import { Router } from 'express'
import { makeRemoteLockVehicleHandler } from './RemoteLockVehicle.handler'
import type { RemoteLockVehicleRequest } from './RemoteLockVehicle.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makeRemoteLockVehicleHandler(container.remoteLockVehicle)

router.post('/operator/vehicles/:vehicleId/lock', async (req, res) => {
  const input = req.body as unknown as RemoteLockVehicleRequest
  const result = await handler(input)
  res.status(201).json(result)
})

export { router as remoteLockVehicleRouter }
