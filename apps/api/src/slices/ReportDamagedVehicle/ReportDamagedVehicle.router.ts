import { Router } from 'express'
import { makeReportDamagedVehicleHandler } from './ReportDamagedVehicle.handler'
import type { ReportDamagedVehicleRequest } from './ReportDamagedVehicle.types'
import type { Container } from '../../composition/types'

export function makeReportDamagedVehicleRouter(deps: Container['reportDamagedVehicle']): Router {
  const router = Router()
  const handler = makeReportDamagedVehicleHandler(deps)

  router.post('/vehicles/:vehicleId/report', async (req, res) => {
    const input = req.body as unknown as ReportDamagedVehicleRequest
    const result = await handler(input)
    res.status(201).json(result)
  })

  return router
}
