import { Router } from 'express'
import { makeEstimateWalkTimeHandler } from './EstimateWalkTime.handler'
import type { EstimateWalkTimeRequest } from './EstimateWalkTime.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makeEstimateWalkTimeHandler(container.estimateWalkTime)

router.get('/vehicles/:vehicleId/walk-time', async (req, res) => {
  const input = req.query as unknown as EstimateWalkTimeRequest
  const result = await handler(input)
  res.status(200).json(result)
})

export { router as estimateWalkTimeRouter }
