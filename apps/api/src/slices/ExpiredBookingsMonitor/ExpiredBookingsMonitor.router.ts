import { Router } from 'express'
import { makeExpiredBookingsMonitorHandler } from './ExpiredBookingsMonitor.handler'
import type { ExpiredBookingsMonitorRequest } from './ExpiredBookingsMonitor.types'
import type { Container } from '../../composition/types'

export function makeExpiredBookingsMonitorRouter(deps: Container['expiredBookingsMonitor']): Router {
  const router = Router()
  const handler = makeExpiredBookingsMonitorHandler(deps)

  router.get('/operator/bookings/expired', async (req, res) => {
    const input = req.query as unknown as ExpiredBookingsMonitorRequest
    const result = await handler(input)
    res.status(200).json(result)
  })

  return router
}
