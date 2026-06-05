import { useState } from 'react'
import type { ReceiveMalfunctionReportViewState } from './ReceiveMalfunctionReport.types'

export function useReceiveMalfunctionReport(): ReceiveMalfunctionReportViewState {
  const [status] = useState<ReceiveMalfunctionReportViewState['status']>('idle')
  return { status }
}
