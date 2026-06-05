// Local view-state types for the VehicleGPSHistory slice.
// Import shared domain types only from '@vsa/contracts'.

export interface VehicleGPSHistoryViewState {
  status: 'idle' | 'loading' | 'error'
}
