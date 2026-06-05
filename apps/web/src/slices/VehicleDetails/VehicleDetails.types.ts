// Local view-state types for the VehicleDetails slice.
// Import shared domain types only from '@vsa/contracts'.

export interface VehicleDetailsViewState {
  status: 'idle' | 'loading' | 'error'
}
