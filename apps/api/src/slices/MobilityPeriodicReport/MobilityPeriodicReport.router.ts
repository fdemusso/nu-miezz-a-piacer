import { Router } from 'express'
import { makeMobilityPeriodicReportHandler } from './MobilityPeriodicReport.handler'
import type { Container } from '../../composition/types'
import { requireAuth } from '../../middleware/fakeAuth'

export function makeMobilityPeriodicReportRouter(deps: Container['mobilityPeriodicReport']): Router {
  const router = Router()
  const handler = makeMobilityPeriodicReportHandler(deps)

  router.get('/reports/mobility', requireAuth('admin'), async (req, res) => {
    try {
      const input = {
        from: req.query.from as string,
        to: req.query.to as string,
      }
      const result = await handler(input)
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}
