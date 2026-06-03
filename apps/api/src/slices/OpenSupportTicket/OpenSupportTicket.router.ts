import { Router } from 'express'
import { makeOpenSupportTicketHandler } from './OpenSupportTicket.handler'
import type { Container } from '../../composition/types'
import { requireAuth } from '../../middleware/fakeAuth'

export function makeOpenSupportTicketRouter(deps: Container['openSupportTicket']): Router {
  const router = Router()
  const handler = makeOpenSupportTicketHandler(deps)

  router.post('/support/tickets', requireAuth('customer'), async (req, res) => {
    try {
      const input = {
        userId: req.user!.userId,
        subject: req.body.subject,
        body: req.body.body,
      }
      const result = await handler(input)
      res.status(201).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}
