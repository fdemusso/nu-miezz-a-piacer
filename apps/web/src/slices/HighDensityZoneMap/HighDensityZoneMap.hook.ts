import { useState } from 'react'
import type { HighDensityZoneMapViewState } from './HighDensityZoneMap.types'

export function useHighDensityZoneMap(): HighDensityZoneMapViewState {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { loading, error }
}
