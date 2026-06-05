// Local view-state types for the PauseRide slice.
// Import shared domain types only from '@vsa/contracts'.

export interface PauseRideViewState {
  status: 'idle' | 'loading' | 'error'
}
