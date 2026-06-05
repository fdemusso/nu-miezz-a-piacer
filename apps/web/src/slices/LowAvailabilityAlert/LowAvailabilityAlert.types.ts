// Local view-state types for the LowAvailabilityAlert slice.
// Import shared domain types only from '@vsa/contracts'.

export interface LowAvailabilityAlertViewState {
  status: 'idle' | 'loading' | 'error'
}
