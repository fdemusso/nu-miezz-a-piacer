import { Router } from 'express'
import { makeExpiredBookingsMonitorHandler } from './ExpiredBookingsMonitor.handler'
import type { Container } from '../../composition/types'

export function makeExpiredBookingsMonitorRouter(deps: Container['expiredBookingsMonitor']): Router {
  const router = Router()
  const handler = makeExpiredBookingsMonitorHandler(deps)

  router.post('/admin/expired-bookings/sweep', async (req, res) => {
    try {
      const result = await handler({})
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}
