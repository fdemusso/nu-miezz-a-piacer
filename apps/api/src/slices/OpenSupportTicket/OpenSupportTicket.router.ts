import { Router } from 'express'
import { makeOpenSupportTicketHandler } from './OpenSupportTicket.handler'
import type { OpenSupportTicketRequest } from './OpenSupportTicket.types'
import type { Container } from '../../composition/types'

export function makeOpenSupportTicketRouter(deps: Container['openSupportTicket']): Router {
  const router = Router()
  const handler = makeOpenSupportTicketHandler(deps)

  router.post('/support/tickets', async (req, res) => {
    const input = req.body as unknown as OpenSupportTicketRequest
    const result = await handler(input)
    res.status(201).json(result)
  })

  return router
}
