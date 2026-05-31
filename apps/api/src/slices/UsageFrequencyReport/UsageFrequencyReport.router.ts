import { Router } from 'express'
import { makeUsageFrequencyReportHandler } from './UsageFrequencyReport.handler'
import type { UsageFrequencyReportRequest } from './UsageFrequencyReport.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makeUsageFrequencyReportHandler(container.usageFrequencyReport)

router.get('/admin/reports/usage-frequency', async (req, res) => {
  const input = req.query as unknown as UsageFrequencyReportRequest
  const result = await handler(input)
  res.status(200).json(result)
})

export { router as usageFrequencyReportRouter }
