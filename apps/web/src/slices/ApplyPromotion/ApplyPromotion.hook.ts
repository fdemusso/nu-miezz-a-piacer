import { useState } from 'react'
import type { ApplyPromotionViewState } from './ApplyPromotion.types'

export function useApplyPromotion(): ApplyPromotionViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
