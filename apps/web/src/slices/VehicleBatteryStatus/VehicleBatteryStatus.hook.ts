import { useState } from 'react'
import type { VehicleBatteryStatusViewState } from './VehicleBatteryStatus.types'

export function useVehicleBatteryStatus(): VehicleBatteryStatusViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
