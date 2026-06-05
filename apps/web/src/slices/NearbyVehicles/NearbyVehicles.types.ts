// Local view-state types for the NearbyVehicles slice.
// Import shared domain types only from '@vsa/contracts'.

export interface NearbyVehiclesViewState {
  status: 'idle' | 'loading' | 'error'
}
