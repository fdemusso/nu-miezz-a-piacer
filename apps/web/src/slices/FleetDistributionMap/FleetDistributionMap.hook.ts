import { useState } from 'react'
import type { FleetDistributionMapViewState } from './FleetDistributionMap.types'

export function useFleetDistributionMap(): FleetDistributionMapViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
