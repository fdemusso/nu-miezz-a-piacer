import { Router } from 'express'
import { makeFleetDistributionMapHandler } from './FleetDistributionMap.handler'
import type { FleetDistributionMapRequest } from './FleetDistributionMap.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makeFleetDistributionMapHandler(container.fleetDistributionMap)

router.get('/operator/fleet/map', async (req, res) => {
  const input = req.query as unknown as FleetDistributionMapRequest
  const result = await handler(input)
  res.status(200).json(result)
})

export { router as fleetDistributionMapRouter }
