import { Router } from 'express'
import { makeNearbyVehiclesHandler } from './NearbyVehicles.handler'
import type { NearbyVehiclesRequest } from './NearbyVehicles.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makeNearbyVehiclesHandler(container.nearbyVehicles)

router.get('/vehicles/nearby', async (req, res) => {
  const input = req.query as unknown as NearbyVehiclesRequest
  const result = await handler(input)
  res.status(200).json(result)
})

export { router as nearbyVehiclesRouter }
