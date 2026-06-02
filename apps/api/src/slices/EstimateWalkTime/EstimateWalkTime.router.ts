import { Router } from 'express'
import { makeEstimateWalkTimeHandler } from './EstimateWalkTime.handler'
import type { EstimateWalkTimeRequest } from './EstimateWalkTime.types'
import type { Container } from '../../composition/types'

export function makeEstimateWalkTimeRouter(deps: Container['estimateWalkTime']): Router {
  const router = Router()
  const handler = makeEstimateWalkTimeHandler(deps)

  router.get('/vehicles/:vehicleId/walk-time', async (req, res) => {
    const input = req.query as unknown as EstimateWalkTimeRequest
    const result = await handler(input)
    res.status(200).json(result)
  })

  return router
}
