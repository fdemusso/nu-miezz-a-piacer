import { Router } from 'express'
import { makeUnlockMethodHandler } from './UnlockMethod.handler'
import type { Container } from '../../composition/types'

export function makeUnlockMethodRouter(deps: Container['unlockMethod']): Router {
  const router = Router()
  const handler = makeUnlockMethodHandler(deps)

  router.get('/vehicles/:vehicleId/unlock-methods', async (req, res) => {
    try {
      const input = { vehicleId: req.params.vehicleId }
      const result = await handler(input)
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}
