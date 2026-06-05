// Local view-state types for the ManageSupportTickets slice.
// Import shared domain types only from '@vsa/contracts'.

export interface ManageSupportTicketsViewState {
  status: 'idle' | 'loading' | 'error'
}
