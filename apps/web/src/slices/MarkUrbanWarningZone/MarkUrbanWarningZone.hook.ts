import { useState } from 'react'
import type { MarkUrbanWarningZoneViewState } from './MarkUrbanWarningZone.types'

export function useMarkUrbanWarningZone(): MarkUrbanWarningZoneViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
