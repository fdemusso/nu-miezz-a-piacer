import { useState } from 'react'
import type { MobilityPeriodicReportViewState } from './MobilityPeriodicReport.types'

export function useMobilityPeriodicReport(): MobilityPeriodicReportViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
