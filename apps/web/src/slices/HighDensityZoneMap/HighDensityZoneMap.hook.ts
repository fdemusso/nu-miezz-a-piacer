import { useState } from 'react'
import type { HighDensityZoneMapViewState } from './HighDensityZoneMap.types'

export function useHighDensityZoneMap(): HighDensityZoneMapViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
