import { Router } from 'express'
import { makeReportDamagedVehicleHandler } from './ReportDamagedVehicle.handler'
import type { Container } from '../../composition/types'
import { requireAuth } from '../../middleware/fakeAuth'

export function makeReportDamagedVehicleRouter(deps: Container['reportDamagedVehicle']): Router {
  const router = Router()
  const handler = makeReportDamagedVehicleHandler(deps)

  router.post('/vehicles/:vehicleId/report-damage', requireAuth('customer'), async (req, res) => {
    try {
      const input = {
        vehicleId: req.params.vehicleId,
        description: req.body.description,
        severity: req.body.severity,
      }
      const result = await handler(input)
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}
