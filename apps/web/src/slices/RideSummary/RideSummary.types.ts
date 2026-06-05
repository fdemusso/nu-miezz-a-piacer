// Local view-state types for the RideSummary slice.
// Import shared domain types only from '@vsa/contracts'.

export interface RideSummaryViewState {
  status: 'idle' | 'loading' | 'error'
}
