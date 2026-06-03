import { Router } from 'express'
import { makeUsageFrequencyReportHandler } from './UsageFrequencyReport.handler'
import type { Container } from '../../composition/types'
import { requireAuth } from '../../middleware/fakeAuth'

export function makeUsageFrequencyReportRouter(deps: Container['usageFrequencyReport']): Router {
  const router = Router()
  const handler = makeUsageFrequencyReportHandler(deps)

  router.get('/reports/usage', requireAuth('admin'), async (req, res) => {
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
