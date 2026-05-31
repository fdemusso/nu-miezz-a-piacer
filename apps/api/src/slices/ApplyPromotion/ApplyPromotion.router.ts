import { Router } from 'express'
import { makeApplyPromotionHandler } from './ApplyPromotion.handler'
import type { ApplyPromotionRequest } from './ApplyPromotion.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makeApplyPromotionHandler(container.applyPromotion)

router.post('/promotions/apply', async (req, res) => {
  const input = req.body as unknown as ApplyPromotionRequest
  const result = await handler(input)
  res.status(201).json(result)
})

export { router as applyPromotionRouter }
