import { Router } from 'express'
import { makeReceiveMalfunctionReportHandler } from './ReceiveMalfunctionReport.handler'
import type { ReceiveMalfunctionReportRequest } from './ReceiveMalfunctionReport.types'
import type { Container } from '../../composition/types'

export function makeReceiveMalfunctionReportRouter(deps: Container['receiveMalfunctionReport']): Router {
  const router = Router()
  const handler = makeReceiveMalfunctionReportHandler(deps)

  router.get('/operator/reports/malfunction', async (req, res) => {
    const input = req.query as unknown as ReceiveMalfunctionReportRequest
    const result = await handler(input)
    res.status(200).json(result)
  })

  return router
}
