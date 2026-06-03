import { Router } from 'express'
import { makeVehicleGPSHistoryHandler } from './VehicleGPSHistory.handler'
import type { Container } from '../../composition/types'
import { requireAuth } from '../../middleware/fakeAuth'

export function makeVehicleGPSHistoryRouter(deps: Container['vehicleGPSHistory']): Router {
  const router = Router()
  const handler = makeVehicleGPSHistoryHandler(deps)

  router.get('/vehicles/:vehicleId/gps-history', requireAuth('operator'), async (req, res) => {
    try {
      const input = {
        vehicleId: req.params.vehicleId,
        from: req.query.from as string,
        to: req.query.to as string,
      }
      const result = await handler(input)
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}
