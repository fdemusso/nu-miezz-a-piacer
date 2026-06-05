import { useState } from 'react'
import type { RideSummaryViewState } from './RideSummary.types'

export function useRideSummary(): RideSummaryViewState {
  const [status] = useState<RideSummaryViewState['status']>('idle')
  return { status }
}
