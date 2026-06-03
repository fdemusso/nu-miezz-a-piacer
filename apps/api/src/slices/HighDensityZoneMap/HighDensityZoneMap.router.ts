import { Router } from 'express'
import { makeHighDensityZoneMapHandler } from './HighDensityZoneMap.handler'
import type { Container } from '../../composition/types'
import { requireAuth } from '../../middleware/fakeAuth'

export function makeHighDensityZoneMapRouter(deps: Container['highDensityZoneMap']): Router {
  const router = Router()
  const handler = makeHighDensityZoneMapHandler(deps)

  router.get('/reports/high-density', requireAuth('admin'), async (req, res) => {
    try {
      const result = await handler({})
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}
