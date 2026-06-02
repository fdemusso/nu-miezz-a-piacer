import { Router } from 'express'
import { makeManagePaymentMethodHandler } from './ManagePaymentMethod.handler'
import type { ManagePaymentMethodRequest } from './ManagePaymentMethod.types'
import type { Container } from '../../composition/types'

export function makeManagePaymentMethodRouter(deps: Container['managePaymentMethod']): Router {
  const router = Router()
  const handler = makeManagePaymentMethodHandler(deps)

  router.post('/users/payment-methods', async (req, res) => {
    const input = req.body as unknown as ManagePaymentMethodRequest
    const result = await handler(input)
    res.status(201).json(result)
  })

  return router
}
