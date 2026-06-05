import { useState } from 'react'
import type { FleetDistributionMapViewState } from './FleetDistributionMap.types'

export function useFleetDistributionMap(): FleetDistributionMapViewState {
  const [status] = useState<FleetDistributionMapViewState['status']>('idle')
  return { status }
}
