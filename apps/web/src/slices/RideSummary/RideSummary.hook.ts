import { useState } from 'react'
import type { RideSummaryViewState } from './RideSummary.types'

export function useRideSummary(): RideSummaryViewState {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { loading, error }
}
