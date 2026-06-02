import { Router } from 'express'
import { makeMobilityPeriodicReportHandler } from './MobilityPeriodicReport.handler'
import type { MobilityPeriodicReportRequest } from './MobilityPeriodicReport.types'
import type { Container } from '../../composition/types'

export function makeMobilityPeriodicReportRouter(deps: Container['mobilityPeriodicReport']): Router {
  const router = Router()
  const handler = makeMobilityPeriodicReportHandler(deps)

  router.get('/admin/reports/periodic', async (req, res) => {
    const input = req.query as unknown as MobilityPeriodicReportRequest
    const result = await handler(input)
    res.status(200).json(result)
  })

  return router
}
