import type { SupportTicket } from '@vsa/contracts'

export interface OpenSupportTicketRequest {
  userId: string
  subject: string
  body: string
}

export interface OpenSupportTicketResponse {
  ticket: SupportTicket
}
