import { useState } from 'react'
import type { UsageFrequencyReportViewState } from './UsageFrequencyReport.types'

export function useUsageFrequencyReport(): UsageFrequencyReportViewState {
  const [status] = useState<UsageFrequencyReportViewState['status']>('idle')
  return { status }
}
