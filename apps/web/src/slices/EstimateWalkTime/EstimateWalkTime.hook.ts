import { useState } from 'react'
import type { EstimateWalkTimeViewState } from './EstimateWalkTime.types'

export function useEstimateWalkTime(): EstimateWalkTimeViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
