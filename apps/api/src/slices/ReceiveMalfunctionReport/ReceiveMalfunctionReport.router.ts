import { Router } from 'express'
import { makeReceiveMalfunctionReportHandler } from './ReceiveMalfunctionReport.handler'
import type { Container } from '../../composition/types'
import { requireAuth } from '../../middleware/fakeAuth'

export function makeReceiveMalfunctionReportRouter(deps: Container['receiveMalfunctionReport']): Router {
  const router = Router()
  const handler = makeReceiveMalfunctionReportHandler(deps)

  router.get('/maintenance/malfunctions', requireAuth('operator'), async (req, res) => {
    try {
      const result = await handler({})
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}
