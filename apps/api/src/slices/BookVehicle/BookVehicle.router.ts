import { Router } from 'express'
import { makeBookVehicleHandler } from './BookVehicle.handler'
import type { Container } from '../../composition/types'
import { requireAuth } from '../../middleware/fakeAuth'

export function makeBookVehicleRouter(deps: Container['bookVehicle']): Router {
  const router = Router()
  const handler = makeBookVehicleHandler(deps)

  router.post('/bookings', requireAuth('customer'), async (req, res) => {
    try {
      const input = { ...req.body, userId: req.user!.userId }
      const result = await handler(input)
      res.status(201).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}
