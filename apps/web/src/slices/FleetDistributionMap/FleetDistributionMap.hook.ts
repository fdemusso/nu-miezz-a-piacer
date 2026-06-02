import { useState } from 'react'
import type { FleetDistributionMapViewState } from './FleetDistributionMap.types'

export function useFleetDistributionMap(): FleetDistributionMapViewState {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { loading, error }
}
