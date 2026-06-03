import { Router } from 'express'
import { makePauseRideHandler } from './PauseRide.handler'
import type { Container } from '../../composition/types'
import { requireAuth } from '../../middleware/fakeAuth'

export function makePauseRideRouter(deps: Container['pauseRide']): Router {
  const router = Router()
  const handler = makePauseRideHandler(deps)

  router.post('/rides/pause', requireAuth('customer'), async (req, res) => {
    try {
      const input = { userId: req.user!.userId }
      const result = await handler(input)
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}
