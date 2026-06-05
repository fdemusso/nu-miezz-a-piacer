// Local view-state types for the ManagePaymentMethod slice.
// Import shared domain types only from '@vsa/contracts'.

export interface ManagePaymentMethodViewState {
  status: 'idle' | 'loading' | 'error'
}
