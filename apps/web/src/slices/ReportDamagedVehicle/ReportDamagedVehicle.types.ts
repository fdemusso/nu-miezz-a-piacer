// Local view-state types for the ReportDamagedVehicle slice.
// Import shared domain types only from '@vsa/contracts'.

export interface ReportDamagedVehicleViewState {
  status: 'idle' | 'loading' | 'error'
}
