import { Router } from 'express'
import { makePauseRideHandler } from './PauseRide.handler'
import type { PauseRideRequest } from './PauseRide.types'
import type { Container } from '../../composition/types'

export function makePauseRideRouter(deps: Container['pauseRide']): Router {
  const router = Router()
  const handler = makePauseRideHandler(deps)

  router.post('/rides/:rideId/pause', async (req, res) => {
    const input = req.body as unknown as PauseRideRequest
    const result = await handler(input)
    res.status(201).json(result)
  })

  return router
}
