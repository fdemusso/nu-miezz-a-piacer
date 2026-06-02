import { Router } from 'express'
import { makeLowAvailabilityAlertHandler } from './LowAvailabilityAlert.handler'
import type { LowAvailabilityAlertRequest } from './LowAvailabilityAlert.types'
import type { Container } from '../../composition/types'

export function makeLowAvailabilityAlertRouter(deps: Container['lowAvailabilityAlert']): Router {
  const router = Router()
  const handler = makeLowAvailabilityAlertHandler(deps)

  router.get('/operator/fleet/low-availability', async (req, res) => {
    const input = req.query as unknown as LowAvailabilityAlertRequest
    const result = await handler(input)
    res.status(200).json(result)
  })

  return router
}
