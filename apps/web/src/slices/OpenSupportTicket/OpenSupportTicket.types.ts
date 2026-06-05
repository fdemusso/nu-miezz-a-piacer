// Local view-state types for the OpenSupportTicket slice.
// Import shared domain types only from '@vsa/contracts'.

export interface OpenSupportTicketViewState {
  status: 'idle' | 'loading' | 'error'
}
