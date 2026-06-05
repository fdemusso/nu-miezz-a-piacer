// Local view-state types for the RemoteLockVehicle slice.
// Import shared domain types only from '@vsa/contracts'.

export interface RemoteLockVehicleViewState {
  status: 'idle' | 'loading' | 'error'
}
