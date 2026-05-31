import { Router } from 'express'
import { makeReportDamagedVehicleHandler } from './ReportDamagedVehicle.handler'
import type { ReportDamagedVehicleRequest } from './ReportDamagedVehicle.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makeReportDamagedVehicleHandler(container.reportDamagedVehicle)

router.post('/vehicles/:vehicleId/report', async (req, res) => {
  const input = req.body as unknown as ReportDamagedVehicleRequest
  const result = await handler(input)
  res.status(201).json(result)
})

export { router as reportDamagedVehicleRouter }
