import { Router } from 'express'
import { makeRemoteLockVehicleHandler } from './RemoteLockVehicle.handler'
import type { Container } from '../../composition/types'
import { requireAuth } from '../../middleware/fakeAuth'

export function makeRemoteLockVehicleRouter(deps: Container['remoteLockVehicle']): Router {
  const router = Router()
  const handler = makeRemoteLockVehicleHandler(deps)

  router.post('/vehicles/:vehicleId/remote-lock', requireAuth('operator'), async (req, res) => {
    try {
      const input = {
        vehicleId: req.params.vehicleId,
        reason: req.body?.reason,
      }
      const result = await handler(input)
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}
