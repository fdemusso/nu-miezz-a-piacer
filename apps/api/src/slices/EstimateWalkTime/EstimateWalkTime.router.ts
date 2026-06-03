import { Router } from 'express'
import { makeEstimateWalkTimeHandler } from './EstimateWalkTime.handler'
import type { EstimateWalkTimeRequest } from './EstimateWalkTime.types'
import type { Container } from '../../composition/types'

export function makeEstimateWalkTimeRouter(deps: Container['estimateWalkTime']): Router {
  const router = Router()
  const handler = makeEstimateWalkTimeHandler(deps)

  router.get('/vehicles/:vehicleId/walk-time', async (req, res) => {
    try {
      const input: EstimateWalkTimeRequest = {
        vehicleId: req.params.vehicleId,
        fromLat: req.query.fromLat as string,
        fromLng: req.query.fromLng as string,
      }
      const result = await handler(input)
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}
