import { useState } from 'react'
import type { ReceiveMalfunctionReportViewState } from './ReceiveMalfunctionReport.types'

export function useReceiveMalfunctionReport(): ReceiveMalfunctionReportViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
