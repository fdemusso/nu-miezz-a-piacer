import { Router } from 'express'
import { makeRideSummaryHandler } from './RideSummary.handler'
import type { RideSummaryRequest } from './RideSummary.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makeRideSummaryHandler(container.rideSummary)

router.get('/rides/:rideId/summary', async (req, res) => {
  const input = req.query as unknown as RideSummaryRequest
  const result = await handler(input)
  res.status(200).json(result)
})

export { router as rideSummaryRouter }
