import { Router } from 'express'
import { makeHighDensityZoneMapHandler } from './HighDensityZoneMap.handler'
import type { HighDensityZoneMapRequest } from './HighDensityZoneMap.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makeHighDensityZoneMapHandler(container.highDensityZoneMap)

router.get('/admin/reports/high-density', async (req, res) => {
  const input = req.query as unknown as HighDensityZoneMapRequest
  const result = await handler(input)
  res.status(200).json(result)
})

export { router as highDensityZoneMapRouter }
