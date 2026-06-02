import { useState } from 'react'
import type { EstimateWalkTimeViewState } from './EstimateWalkTime.types'

export function useEstimateWalkTime(): EstimateWalkTimeViewState {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { loading, error }
}
