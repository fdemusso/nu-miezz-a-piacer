import { Router } from 'express'
import { makeConfigureParkingBonusHandler } from './ConfigureParkingBonus.handler'
import type { ConfigureParkingBonusRequest } from './ConfigureParkingBonus.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makeConfigureParkingBonusHandler(container.configureParkingBonus)

router.post('/operator/parking-bonus', async (req, res) => {
  const input = req.body as unknown as ConfigureParkingBonusRequest
  const result = await handler(input)
  res.status(201).json(result)
})

export { router as configureParkingBonusRouter }
