import { Router } from 'express'
import { makeEstimateRideCostHandler } from './EstimateRideCost.handler'
import type { EstimateRideCostRequest } from './EstimateRideCost.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makeEstimateRideCostHandler(container.estimateRideCost)

router.get('/rides/estimate-cost', async (req, res) => {
  const input = req.query as unknown as EstimateRideCostRequest
  const result = await handler(input)
  res.status(200).json(result)
})

export { router as estimateRideCostRouter }
