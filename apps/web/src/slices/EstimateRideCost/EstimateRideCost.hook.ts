import { useState } from 'react'
import type { EstimateRideCostViewState } from './EstimateRideCost.types'

export function useEstimateRideCost(): EstimateRideCostViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
