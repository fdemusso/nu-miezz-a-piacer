import { Router } from 'express'
import { makeApplyPromotionHandler } from './ApplyPromotion.handler'
import type { ApplyPromotionRequest } from './ApplyPromotion.types'
import type { Container } from '../../composition/types'

export function makeApplyPromotionRouter(deps: Container['applyPromotion']): Router {
  const router = Router()
  const handler = makeApplyPromotionHandler(deps)

  router.post('/promotions/apply', async (req, res) => {
    const input = req.body as unknown as ApplyPromotionRequest
    const result = await handler(input)
    res.status(201).json(result)
  })

  return router
}
