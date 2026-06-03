import { Router } from 'express'
import { makeEstimateRideCostHandler } from './EstimateRideCost.handler'
import type { EstimateRideCostRequest } from './EstimateRideCost.types'
import type { Container } from '../../composition/types'

export function makeEstimateRideCostRouter(deps: Container['estimateRideCost']): Router {
  const router = Router()
  const handler = makeEstimateRideCostHandler(deps)

  router.get('/rides/estimate-cost', async (req, res) => {
    try {
      const result = await handler(req.query as unknown as EstimateRideCostRequest)
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}
