import { Router } from 'express'
import { makeRideSummaryHandler } from './RideSummary.handler'
import type { RideSummaryRequest } from './RideSummary.types'
import type { Container } from '../../composition/types'

export function makeRideSummaryRouter(deps: Container['rideSummary']): Router {
  const router = Router()
  const handler = makeRideSummaryHandler(deps)

  router.get('/rides/:rideId/summary', async (req, res) => {
    const input = req.query as unknown as RideSummaryRequest
    const result = await handler(input)
    res.status(200).json(result)
  })

  return router
}
