import { Router } from 'express'
import { makeMaintenanceQueueHandler } from './MaintenanceQueue.handler'
import type { MaintenanceQueueRequest } from './MaintenanceQueue.types'
import type { Container } from '../../composition/types'

export function makeMaintenanceQueueRouter(deps: Container['maintenanceQueue']): Router {
  const router = Router()
  const handler = makeMaintenanceQueueHandler(deps)

  router.get('/operator/maintenance/queue', async (req, res) => {
    const input = req.query as unknown as MaintenanceQueueRequest
    const result = await handler(input)
    res.status(200).json(result)
  })

  return router
}
