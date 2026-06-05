// Local view-state types for the EstimateWalkTime slice.
// Import shared domain types only from '@vsa/contracts'.

export interface EstimateWalkTimeViewState {
  status: 'idle' | 'loading' | 'error'
}
