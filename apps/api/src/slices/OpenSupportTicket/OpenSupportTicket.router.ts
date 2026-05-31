import { Router } from 'express'
import { makeOpenSupportTicketHandler } from './OpenSupportTicket.handler'
import type { OpenSupportTicketRequest } from './OpenSupportTicket.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makeOpenSupportTicketHandler(container.openSupportTicket)

router.post('/support/tickets', async (req, res) => {
  const input = req.body as unknown as OpenSupportTicketRequest
  const result = await handler(input)
  res.status(201).json(result)
})

export { router as openSupportTicketRouter }
