import { Router } from 'express'
import { makeEndRideHandler } from './EndRide.handler'
import type { EndRideRequest } from './EndRide.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makeEndRideHandler(container.endRide)

router.post('/rides/:rideId/end', async (req, res) => {
  const input = req.body as unknown as EndRideRequest
  const result = await handler(input)
  res.status(201).json(result)
})

export { router as endRideRouter }
