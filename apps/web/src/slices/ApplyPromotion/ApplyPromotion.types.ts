// Local view-state types for the ApplyPromotion slice.
// Import shared domain types only from '@vsa/contracts'.

export interface ApplyPromotionViewState {
  status: 'idle' | 'loading' | 'error'
}
