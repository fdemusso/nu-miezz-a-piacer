import { useState } from 'react'
import type { ApplyPromotionViewState } from './ApplyPromotion.types'

export function useApplyPromotion(): ApplyPromotionViewState {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { loading, error }
}
