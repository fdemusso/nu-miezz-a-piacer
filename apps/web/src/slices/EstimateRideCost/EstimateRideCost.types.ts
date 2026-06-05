// Local view-state types for the EstimateRideCost slice.
// Import shared domain types only from '@vsa/contracts'.

export interface EstimateRideCostViewState {
  status: 'idle' | 'loading' | 'error'
}
