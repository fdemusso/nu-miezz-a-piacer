import { Router } from 'express'
import { makePauseRideHandler } from './PauseRide.handler'
import type { PauseRideRequest } from './PauseRide.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makePauseRideHandler(container.pauseRide)

router.post('/rides/:rideId/pause', async (req, res) => {
  const input = req.body as unknown as PauseRideRequest
  const result = await handler(input)
  res.status(201).json(result)
})

export { router as pauseRideRouter }
