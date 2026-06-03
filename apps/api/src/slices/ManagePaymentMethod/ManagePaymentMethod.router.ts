import { Router } from 'express'
import { makeManagePaymentMethodHandler } from './ManagePaymentMethod.handler'
import { requireAuth } from '../../middleware/fakeAuth'
import type { Container } from '../../composition/types'

export function makeManagePaymentMethodRouter(deps: Container['managePaymentMethod']): Router {
  const router = Router()
  const handler = makeManagePaymentMethodHandler(deps)

  router.get('/users/payment-methods', requireAuth('customer'), async (req, res) => {
    try {
      const result = await handler({ action: 'list', userId: req.user!.userId })
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  router.post('/users/payment-methods', requireAuth('customer'), async (req, res) => {
    try {
      const result = await handler({ action: 'add', userId: req.user!.userId, method: req.body })
      res.status(201).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  router.delete('/users/payment-methods/:methodId', requireAuth('customer'), async (req, res) => {
    try {
      const result = await handler({ action: 'remove', userId: req.user!.userId, methodId: req.params.methodId })
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}
