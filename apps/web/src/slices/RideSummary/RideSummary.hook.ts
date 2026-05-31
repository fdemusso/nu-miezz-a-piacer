import { useState } from 'react'
import type { RideSummaryViewState } from './RideSummary.types'

export function useRideSummary(): RideSummaryViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
