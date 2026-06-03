import { Router } from 'express'
import { makeManageSupportTicketsHandler } from './ManageSupportTickets.handler'
import type { Container } from '../../composition/types'
import { requireAuth } from '../../middleware/fakeAuth'

export function makeManageSupportTicketsRouter(deps: Container['manageSupportTickets']): Router {
  const router = Router()
  const { listTickets, updateTicketStatus } = makeManageSupportTicketsHandler(deps)

  router.get('/support/tickets', requireAuth('operator'), async (req, res) => {
    try {
      const result = await listTickets({})
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  router.patch('/support/tickets/:ticketId/status', requireAuth('operator'), async (req, res) => {
    try {
      const result = await updateTicketStatus({
        ticketId: req.params.ticketId,
        status: req.body.status,
      })
      res.status(200).json(result)
    } catch (err: any) {
      res.status(err?.status ?? 500).json({ error: err?.message ?? 'Internal server error' })
    }
  })

  return router
}
