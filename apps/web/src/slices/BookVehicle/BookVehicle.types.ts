// Local view-state types for the BookVehicle slice.
// Import shared domain types only from '@vsa/contracts'.

export interface BookVehicleViewState {
  status: 'idle' | 'loading' | 'error'
}
