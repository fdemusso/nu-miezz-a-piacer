import { Router } from 'express'
import { makeUnlockMethodHandler } from './UnlockMethod.handler'
import type { UnlockMethodRequest } from './UnlockMethod.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makeUnlockMethodHandler(container.unlockMethod)

router.get('/vehicles/:vehicleId/unlock-methods', async (req, res) => {
  const input = req.query as unknown as UnlockMethodRequest
  const result = await handler(input)
  res.status(200).json(result)
})

export { router as unlockMethodRouter }
