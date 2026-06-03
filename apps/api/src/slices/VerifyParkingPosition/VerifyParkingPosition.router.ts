import { Router } from 'express'
import { makeVerifyParkingPositionHandler } from './VerifyParkingPosition.handler'
import type { Container } from '../../composition/types'
import { requireAuth } from '../../middleware/fakeAuth'

export function makeVerifyParkingPositionRouter(deps: Container['verifyParkingPosition']): Router {
  const router = Router()
  const handler = makeVerifyParkingPositionHandler(deps)

  router.get('/vehicles/:vehicleId/verify-parking', requireAuth('operator'), async (req, res) => {
    try {
      const result = await handler({ vehicleId: req.params.vehicleId })
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}
