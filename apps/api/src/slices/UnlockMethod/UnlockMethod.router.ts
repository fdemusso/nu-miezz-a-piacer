import { Router } from 'express'
import { makeUnlockMethodHandler } from './UnlockMethod.handler'
import type { UnlockMethodRequest } from './UnlockMethod.types'
import type { Container } from '../../composition/types'

export function makeUnlockMethodRouter(deps: Container['unlockMethod']): Router {
  const router = Router()
  const handler = makeUnlockMethodHandler(deps)

  router.get('/vehicles/:vehicleId/unlock-methods', async (req, res) => {
    const input = req.query as unknown as UnlockMethodRequest
    const result = await handler(input)
    res.status(200).json(result)
  })

  return router
}
