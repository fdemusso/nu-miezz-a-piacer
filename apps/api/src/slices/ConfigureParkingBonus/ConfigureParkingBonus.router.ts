import { Router } from 'express'
import { makeConfigureParkingBonusHandler } from './ConfigureParkingBonus.handler'
import type { ConfigureParkingBonusRequest } from './ConfigureParkingBonus.types'
import type { Container } from '../../composition/types'

export function makeConfigureParkingBonusRouter(deps: Container['configureParkingBonus']): Router {
  const router = Router()
  const handler = makeConfigureParkingBonusHandler(deps)

  router.post('/operator/parking-bonus', async (req, res) => {
    const input = req.body as unknown as ConfigureParkingBonusRequest
    const result = await handler(input)
    res.status(201).json(result)
  })

  return router
}
