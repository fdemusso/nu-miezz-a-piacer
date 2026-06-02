import { useState } from 'react'
import type { ReceiveMalfunctionReportViewState } from './ReceiveMalfunctionReport.types'

export function useReceiveMalfunctionReport(): ReceiveMalfunctionReportViewState {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { loading, error }
}
