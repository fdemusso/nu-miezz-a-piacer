import { Router } from 'express'
import { makeSuspendUserAccountHandler } from './SuspendUserAccount.handler'
import type { SuspendUserAccountRequest } from './SuspendUserAccount.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makeSuspendUserAccountHandler(container.suspendUserAccount)

router.post('/operator/users/:userId/suspend', async (req, res) => {
  const input = req.body as unknown as SuspendUserAccountRequest
  const result = await handler(input)
  res.status(201).json(result)
})

export { router as suspendUserAccountRouter }
