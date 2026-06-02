import { Router } from 'express'
import { makeEndRideHandler } from './EndRide.handler'
import type { EndRideRequest } from './EndRide.types'
import type { Container } from '../../composition/types'

export function makeEndRideRouter(deps: Container['endRide']): Router {
  const router = Router()
  const handler = makeEndRideHandler(deps)

  router.post('/rides/:rideId/end', async (req, res) => {
    const input = req.body as unknown as EndRideRequest
    const result = await handler(input)
    res.status(201).json(result)
  })

  return router
}
