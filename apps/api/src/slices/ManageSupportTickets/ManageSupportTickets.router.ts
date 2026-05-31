import { Router } from 'express'
import { makeManageSupportTicketsHandler } from './ManageSupportTickets.handler'
import type { ManageSupportTicketsRequest } from './ManageSupportTickets.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makeManageSupportTicketsHandler(container.manageSupportTickets)

router.get('/operator/support/tickets', async (req, res) => {
  const input = req.query as unknown as ManageSupportTicketsRequest
  const result = await handler(input)
  res.status(200).json(result)
})

export { router as manageSupportTicketsRouter }
