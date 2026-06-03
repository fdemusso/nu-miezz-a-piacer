import type { ISupportService } from '@vsa/contracts'
import type { OpenSupportTicketRequest, OpenSupportTicketResponse } from './OpenSupportTicket.types'

export function makeOpenSupportTicketHandler(deps: {
  supportService: ISupportService
}) {
  return async function openSupportTicketHandler(
    req: OpenSupportTicketRequest
  ): Promise<OpenSupportTicketResponse> {
    const { userId, subject, body } = req
    const ticket = await deps.supportService.openTicket(userId, subject, body)
    return { ticket }
  }
}
