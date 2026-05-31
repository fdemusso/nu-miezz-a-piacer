import { Router } from 'express'
import { makeUnlockVehicleHandler } from './UnlockVehicle.handler'
import type { UnlockVehicleRequest } from './UnlockVehicle.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makeUnlockVehicleHandler(container.unlockVehicle)

router.post('/vehicles/:vehicleId/unlock', async (req, res) => {
  const input = req.body as unknown as UnlockVehicleRequest
  const result = await handler(input)
  res.status(201).json(result)
})

export { router as unlockVehicleRouter }
