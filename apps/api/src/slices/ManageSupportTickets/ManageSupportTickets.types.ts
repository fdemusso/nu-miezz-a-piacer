import type { SupportTicket } from '@vsa/contracts'

export interface ListTicketsRequest {
  // no input needed
}

export interface ListTicketsResponse {
  tickets: SupportTicket[]
}

export interface UpdateTicketStatusRequest {
  ticketId: string
  status: 'open' | 'in_progress' | 'resolved'
}

export interface UpdateTicketStatusResponse {
  ticket: SupportTicket
}

// Legacy aliases kept for backward compat with the handler import
export type ManageSupportTicketsRequest = ListTicketsRequest
export type ManageSupportTicketsResponse = ListTicketsResponse
