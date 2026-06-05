// Local view-state types for the ReceiveMalfunctionReport slice.
// Import shared domain types only from '@vsa/contracts'.

export interface ReceiveMalfunctionReportViewState {
  status: 'idle' | 'loading' | 'error'
}
