import { Router } from 'express'
import { makeBookVehicleHandler, makeCancelBookingHandler } from './BookVehicle.handler'
import type { Container } from '../../composition/types'
import { requireAuth } from '../../middleware/fakeAuth'

export function makeBookVehicleRouter(deps: Container['bookVehicle']): Router {
  const router = Router()
  const bookHandler = makeBookVehicleHandler(deps)
  const cancelHandler = makeCancelBookingHandler(deps)

  router.post('/bookings', requireAuth('customer'), async (req, res) => {
    try {
      const input = { ...req.body, userId: req.user!.userId }
      const result = await bookHandler(input)
      res.status(201).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  router.patch('/bookings/:id/cancel', requireAuth('customer'), async (req, res) => {
    try {
      const input = { bookingId: req.params.id, userId: req.user!.userId }
      const result = await cancelHandler(input)
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}

