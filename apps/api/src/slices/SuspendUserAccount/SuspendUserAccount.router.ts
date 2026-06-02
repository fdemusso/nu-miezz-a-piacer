import { Router } from 'express'
import { makeSuspendUserAccountHandler } from './SuspendUserAccount.handler'
import type { SuspendUserAccountRequest } from './SuspendUserAccount.types'
import type { Container } from '../../composition/types'

export function makeSuspendUserAccountRouter(deps: Container['suspendUserAccount']): Router {
  const router = Router()
  const handler = makeSuspendUserAccountHandler(deps)

  router.post('/operator/users/:userId/suspend', async (req, res) => {
    const input = req.body as unknown as SuspendUserAccountRequest
    const result = await handler(input)
    res.status(201).json(result)
  })

  return router
}
