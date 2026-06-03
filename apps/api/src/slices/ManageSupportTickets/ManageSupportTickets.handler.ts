import type { ISupportService, IUserRepository } from '@vsa/contracts'
import type {
  ListTicketsRequest, ListTicketsResponse,
  UpdateTicketStatusRequest, UpdateTicketStatusResponse,
} from './ManageSupportTickets.types'

export function makeManageSupportTicketsHandler(deps: {
  supportService: ISupportService
  userRepo: IUserRepository
}) {
  async function listTickets(_req: ListTicketsRequest): Promise<ListTicketsResponse> {
    const tickets = await deps.supportService.listTickets()
    return { tickets }
  }

  async function updateTicketStatus(req: UpdateTicketStatusRequest): Promise<UpdateTicketStatusResponse> {
    const ticket = await deps.supportService.updateTicketStatus(req.ticketId, req.status)
    return { ticket }
  }

  return { listTickets, updateTicketStatus }
}
