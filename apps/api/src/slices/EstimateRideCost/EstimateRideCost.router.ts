import { Router } from 'express'
import { makeEstimateRideCostHandler } from './EstimateRideCost.handler'
import type { EstimateRideCostRequest } from './EstimateRideCost.types'
import type { Container } from '../../composition/types'

export function makeEstimateRideCostRouter(deps: Container['estimateRideCost']): Router {
  const router = Router()
  const handler = makeEstimateRideCostHandler(deps)

  router.get('/rides/estimate-cost', async (req, res) => {
    const input = req.query as unknown as EstimateRideCostRequest
    const result = await handler(input)
    res.status(200).json(result)
  })

  return router
}
