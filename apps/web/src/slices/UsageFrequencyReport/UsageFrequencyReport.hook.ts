import { useState } from 'react'
import type { UsageFrequencyReportViewState } from './UsageFrequencyReport.types'

export function useUsageFrequencyReport(): UsageFrequencyReportViewState {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { loading, error }
}
