// Local view-state types for the EndRide slice.
// Import shared domain types only from '@vsa/contracts'.

export interface EndRideViewState {
  status: 'idle' | 'loading' | 'error'
}
