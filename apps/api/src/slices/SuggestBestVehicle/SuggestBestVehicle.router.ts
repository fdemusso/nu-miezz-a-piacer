import { Router } from 'express'
import { makeSuggestBestVehicleHandler } from './SuggestBestVehicle.handler'
import type { Container } from '../../composition/types'
import { requireAuth } from '../../middleware/fakeAuth'

export function makeSuggestBestVehicleRouter(deps: Container['suggestBestVehicle']): Router {
  const router = Router()
  const handler = makeSuggestBestVehicleHandler(deps)

  router.get('/vehicles/suggest', requireAuth('customer'), async (req, res) => {
    try {
      const input = {
        fromLat: parseFloat(req.query.fromLat as string),
        fromLng: parseFloat(req.query.fromLng as string),
        toLat: parseFloat(req.query.toLat as string),
        toLng: parseFloat(req.query.toLng as string),
      }
      const result = await handler(input)
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}
