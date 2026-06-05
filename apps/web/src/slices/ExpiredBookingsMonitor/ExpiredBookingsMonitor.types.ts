// Local view-state types for the ExpiredBookingsMonitor slice.
// Import shared domain types only from '@vsa/contracts'.

export interface ExpiredBookingsMonitorViewState {
  status: 'idle' | 'loading' | 'error'
}
