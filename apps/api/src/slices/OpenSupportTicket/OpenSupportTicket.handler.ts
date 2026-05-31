import type { ISupportService } from '@vsa/contracts'
import type { OpenSupportTicketRequest, OpenSupportTicketResponse } from './OpenSupportTicket.types'

export function makeOpenSupportTicketHandler(deps: {
  supportService: ISupportService
}) {
  return async function openSupportTicketHandler(
    req: OpenSupportTicketRequest
  ): Promise<OpenSupportTicketResponse> {
    return {} as OpenSupportTicketResponse
  }
}
