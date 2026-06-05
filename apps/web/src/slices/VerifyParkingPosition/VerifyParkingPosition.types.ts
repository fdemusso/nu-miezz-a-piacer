// Local view-state types for the VerifyParkingPosition slice.
// Import shared domain types only from '@vsa/contracts'.

export interface VerifyParkingPositionViewState {
  status: 'idle' | 'loading' | 'error'
}
