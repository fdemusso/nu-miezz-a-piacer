import { useState } from 'react'
import type { VehicleDetailsViewState } from './VehicleDetails.types'

export function useVehicleDetails(): VehicleDetailsViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
