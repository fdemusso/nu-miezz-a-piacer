import { Router } from 'express'
import { makeManagePaymentMethodHandler } from './ManagePaymentMethod.handler'
import type { ManagePaymentMethodRequest } from './ManagePaymentMethod.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makeManagePaymentMethodHandler(container.managePaymentMethod)

router.post('/users/payment-methods', async (req, res) => {
  const input = req.body as unknown as ManagePaymentMethodRequest
  const result = await handler(input)
  res.status(201).json(result)
})

export { router as managePaymentMethodRouter }
