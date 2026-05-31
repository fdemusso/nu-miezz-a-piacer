import { Router } from 'express'
import { makeLowAvailabilityAlertHandler } from './LowAvailabilityAlert.handler'
import type { LowAvailabilityAlertRequest } from './LowAvailabilityAlert.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makeLowAvailabilityAlertHandler(container.lowAvailabilityAlert)

router.get('/operator/fleet/low-availability', async (req, res) => {
  const input = req.query as unknown as LowAvailabilityAlertRequest
  const result = await handler(input)
  res.status(200).json(result)
})

export { router as lowAvailabilityAlertRouter }
