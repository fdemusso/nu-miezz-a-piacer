import { useState } from 'react'
import type { ApplyPromotionViewState } from './ApplyPromotion.types'

export function useApplyPromotion(): ApplyPromotionViewState {
  const [status] = useState<ApplyPromotionViewState['status']>('idle')
  return { status }
}
