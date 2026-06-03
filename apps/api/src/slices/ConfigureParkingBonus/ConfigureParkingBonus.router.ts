import { Router } from 'express'
import { makeConfigureParkingBonusHandler } from './ConfigureParkingBonus.handler'
import type { Container } from '../../composition/types'
import { requireAuth } from '../../middleware/fakeAuth'

export function makeConfigureParkingBonusRouter(deps: Container['configureParkingBonus']): Router {
  const router = Router()
  const handler = makeConfigureParkingBonusHandler(deps)

  router.post('/fleet/parking-bonus', requireAuth('operator'), async (req, res) => {
    try {
      const result = await handler(req.body)
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}
