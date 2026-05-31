import { Router } from 'express'
import { makeExpiredBookingsMonitorHandler } from './ExpiredBookingsMonitor.handler'
import type { ExpiredBookingsMonitorRequest } from './ExpiredBookingsMonitor.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makeExpiredBookingsMonitorHandler(container.expiredBookingsMonitor)

router.get('/operator/bookings/expired', async (req, res) => {
  const input = req.query as unknown as ExpiredBookingsMonitorRequest
  const result = await handler(input)
  res.status(200).json(result)
})

export { router as expiredBookingsMonitorRouter }
