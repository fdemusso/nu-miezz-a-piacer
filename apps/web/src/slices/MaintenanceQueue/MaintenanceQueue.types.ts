// Local view-state types for the MaintenanceQueue slice.
// Import shared domain types only from '@vsa/contracts'.

export interface MaintenanceQueueViewState {
  status: 'idle' | 'loading' | 'error'
}
