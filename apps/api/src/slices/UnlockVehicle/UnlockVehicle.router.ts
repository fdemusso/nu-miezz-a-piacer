import { Router } from 'express'
import { makeUnlockVehicleHandler } from './UnlockVehicle.handler'
import type { Container } from '../../composition/types'
import { requireAuth } from '../../middleware/fakeAuth'

export function makeUnlockVehicleRouter(deps: Container['unlockVehicle']): Router {
  const router = Router()
  const handler = makeUnlockVehicleHandler(deps)

  router.post('/bookings/:bookingId/unlock', requireAuth('customer'), async (req, res) => {
    try {
      const input = {
        userId: req.user!.userId,
        bookingId: req.params.bookingId,
        method: req.body.method,
      }
      const result = await handler(input)
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}
