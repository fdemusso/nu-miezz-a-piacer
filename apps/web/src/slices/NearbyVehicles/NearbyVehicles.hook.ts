import { useState } from 'react'
import type { NearbyVehiclesViewState } from './NearbyVehicles.types'

export function useNearbyVehicles(): NearbyVehiclesViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
