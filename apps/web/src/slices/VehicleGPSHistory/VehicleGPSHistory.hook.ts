import { useState } from 'react'
import type { VehicleGPSHistoryViewState } from './VehicleGPSHistory.types'

export function useVehicleGPSHistory(): VehicleGPSHistoryViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
