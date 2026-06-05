// Local view-state types for the UsageFrequencyReport slice.
// Import shared domain types only from '@vsa/contracts'.

export interface UsageFrequencyReportViewState {
  status: 'idle' | 'loading' | 'error'
}
