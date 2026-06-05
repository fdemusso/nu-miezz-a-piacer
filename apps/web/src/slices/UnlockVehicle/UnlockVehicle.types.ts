// Local view-state types for the UnlockVehicle slice.
// Import shared domain types only from '@vsa/contracts'.

export interface UnlockVehicleViewState {
  status: 'idle' | 'loading' | 'error'
}
