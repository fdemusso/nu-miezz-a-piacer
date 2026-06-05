import { useState } from 'react'
import type { MobilityPeriodicReportViewState } from './MobilityPeriodicReport.types'

export function useMobilityPeriodicReport(): MobilityPeriodicReportViewState {
  const [status] = useState<MobilityPeriodicReportViewState['status']>('idle')
  return { status }
}
