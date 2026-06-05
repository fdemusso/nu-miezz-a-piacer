// Local view-state types for the SuspendUserAccount slice.
// Import shared domain types only from '@vsa/contracts'.

export interface SuspendUserAccountViewState {
  status: 'idle' | 'loading' | 'error'
}
