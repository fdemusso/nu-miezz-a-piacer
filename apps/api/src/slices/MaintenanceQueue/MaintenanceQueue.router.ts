import { Router } from 'express'
import { makeMaintenanceQueueHandler } from './MaintenanceQueue.handler'
import type { Container } from '../../composition/types'
import { requireAuth } from '../../middleware/fakeAuth'

export function makeMaintenanceQueueRouter(deps: Container['maintenanceQueue']): Router {
  const router = Router()
  const handler = makeMaintenanceQueueHandler(deps)

  router.get('/maintenance/queue', requireAuth('operator'), async (req, res) => {
    try {
      const result = await handler({})
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}
