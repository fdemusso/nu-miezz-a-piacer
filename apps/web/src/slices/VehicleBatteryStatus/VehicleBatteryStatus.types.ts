// Local view-state types for the VehicleBatteryStatus slice.
// Import shared domain types only from '@vsa/contracts'.

export interface VehicleBatteryStatusViewState {
  status: 'idle' | 'loading' | 'error'
}
