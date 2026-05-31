import { Router } from 'express'
import { makeReceiveMalfunctionReportHandler } from './ReceiveMalfunctionReport.handler'
import type { ReceiveMalfunctionReportRequest } from './ReceiveMalfunctionReport.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makeReceiveMalfunctionReportHandler(container.receiveMalfunctionReport)

router.get('/operator/reports/malfunction', async (req, res) => {
  const input = req.query as unknown as ReceiveMalfunctionReportRequest
  const result = await handler(input)
  res.status(200).json(result)
})

export { router as receiveMalfunctionReportRouter }
