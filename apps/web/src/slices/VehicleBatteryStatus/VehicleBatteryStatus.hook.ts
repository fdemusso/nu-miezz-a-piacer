import { useState } from 'react'
import type { VehicleBatteryStatusViewState } from './VehicleBatteryStatus.types'

export function useVehicleBatteryStatus(): VehicleBatteryStatusViewState {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { loading, error }
}
