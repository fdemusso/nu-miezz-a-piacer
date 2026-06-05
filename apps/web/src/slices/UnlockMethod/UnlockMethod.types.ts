// Local view-state types for the UnlockMethod slice.
// Import shared domain types only from '@vsa/contracts'.

export interface UnlockMethodViewState {
  status: 'idle' | 'loading' | 'error'
}
