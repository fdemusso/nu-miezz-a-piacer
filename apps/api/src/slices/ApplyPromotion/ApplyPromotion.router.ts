import { Router } from 'express'
import { makeApplyPromotionHandler } from './ApplyPromotion.handler'
import type { ApplyPromotionRequest } from './ApplyPromotion.types'
import type { Container } from '../../composition/types'

export function makeApplyPromotionRouter(deps: Container['applyPromotion']): Router {
  const router = Router()
  const handler = makeApplyPromotionHandler(deps)

  router.post('/promotions/apply', async (req, res) => {
    try {
      const result = await handler(req.body as ApplyPromotionRequest)
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}
