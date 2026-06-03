import { Router } from 'express'
import { makeSuspendUserAccountHandler } from './SuspendUserAccount.handler'
import type { Container } from '../../composition/types'
import { requireAuth } from '../../middleware/fakeAuth'

export function makeSuspendUserAccountRouter(deps: Container['suspendUserAccount']): Router {
  const router = Router()
  const handler = makeSuspendUserAccountHandler(deps)

  router.post('/admin/users/:userId/suspend', requireAuth('operator'), async (req, res) => {
    try {
      const result = await handler({ userId: req.params.userId })
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}
