// Local view-state types for the FleetDistributionMap slice.
// Import shared domain types only from '@vsa/contracts'.

export interface FleetDistributionMapViewState {
  status: 'idle' | 'loading' | 'error'
}
