import { useState } from 'react'
import type { UsageFrequencyReportViewState } from './UsageFrequencyReport.types'

export function useUsageFrequencyReport(): UsageFrequencyReportViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
