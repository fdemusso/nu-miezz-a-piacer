import { useState } from 'react'
import type { EstimateRideCostViewState } from './EstimateRideCost.types'

export function useEstimateRideCost(): EstimateRideCostViewState {
  const [status] = useState<EstimateRideCostViewState['status']>('idle')
  return { status }
}
