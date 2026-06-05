// Local view-state types for the MobilityPeriodicReport slice.
// Import shared domain types only from '@vsa/contracts'.

export interface MobilityPeriodicReportViewState {
  status: 'idle' | 'loading' | 'error'
}
