import { Router } from 'express'
import { makeHighDensityZoneMapHandler } from './HighDensityZoneMap.handler'
import type { HighDensityZoneMapRequest } from './HighDensityZoneMap.types'
import type { Container } from '../../composition/types'

export function makeHighDensityZoneMapRouter(deps: Container['highDensityZoneMap']): Router {
  const router = Router()
  const handler = makeHighDensityZoneMapHandler(deps)

  router.get('/admin/reports/high-density', async (req, res) => {
    const input = req.query as unknown as HighDensityZoneMapRequest
    const result = await handler(input)
    res.status(200).json(result)
  })

  return router
}
