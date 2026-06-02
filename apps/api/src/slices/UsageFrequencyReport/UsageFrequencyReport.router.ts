import { Router } from 'express'
import { makeUsageFrequencyReportHandler } from './UsageFrequencyReport.handler'
import type { UsageFrequencyReportRequest } from './UsageFrequencyReport.types'
import type { Container } from '../../composition/types'

export function makeUsageFrequencyReportRouter(deps: Container['usageFrequencyReport']): Router {
  const router = Router()
  const handler = makeUsageFrequencyReportHandler(deps)

  router.get('/admin/reports/usage-frequency', async (req, res) => {
    const input = req.query as unknown as UsageFrequencyReportRequest
    const result = await handler(input)
    res.status(200).json(result)
  })

  return router
}
