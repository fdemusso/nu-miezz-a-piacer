import { Router } from 'express'
import { makeManageSupportTicketsHandler } from './ManageSupportTickets.handler'
import type { ManageSupportTicketsRequest } from './ManageSupportTickets.types'
import type { Container } from '../../composition/types'

export function makeManageSupportTicketsRouter(deps: Container['manageSupportTickets']): Router {
  const router = Router()
  const handler = makeManageSupportTicketsHandler(deps)

  router.get('/operator/support/tickets', async (req, res) => {
    const input = req.query as unknown as ManageSupportTicketsRequest
    const result = await handler(input)
    res.status(200).json(result)
  })

  return router
}
