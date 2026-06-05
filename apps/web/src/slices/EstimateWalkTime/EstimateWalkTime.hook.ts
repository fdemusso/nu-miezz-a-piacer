import { useState } from 'react'
import type { EstimateWalkTimeViewState } from './EstimateWalkTime.types'

export function useEstimateWalkTime(): EstimateWalkTimeViewState {
  const [status] = useState<EstimateWalkTimeViewState['status']>('idle')
  return { status }
}
