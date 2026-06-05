// Local view-state types for the SuggestBestVehicle slice.
// Import shared domain types only from '@vsa/contracts'.

export interface SuggestBestVehicleViewState {
  status: 'idle' | 'loading' | 'error'
}
