import { Router } from 'express'
import { makeMaintenanceQueueHandler } from './MaintenanceQueue.handler'
import type { MaintenanceQueueRequest } from './MaintenanceQueue.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makeMaintenanceQueueHandler(container.maintenanceQueue)

router.get('/operator/maintenance/queue', async (req, res) => {
  const input = req.query as unknown as MaintenanceQueueRequest
  const result = await handler(input)
  res.status(200).json(result)
})

export { router as maintenanceQueueRouter }
