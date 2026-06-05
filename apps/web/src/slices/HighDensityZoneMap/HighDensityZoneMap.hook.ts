import { useState } from 'react'
import type { HighDensityZoneMapViewState } from './HighDensityZoneMap.types'

export function useHighDensityZoneMap(): HighDensityZoneMapViewState {
  const [status] = useState<HighDensityZoneMapViewState['status']>('idle')
  return { status }
}
