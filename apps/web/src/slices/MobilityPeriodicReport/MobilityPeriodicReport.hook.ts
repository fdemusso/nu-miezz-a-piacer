import { useState } from 'react'
import type { MobilityPeriodicReportViewState } from './MobilityPeriodicReport.types'

export function useMobilityPeriodicReport(): MobilityPeriodicReportViewState {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { loading, error }
}
