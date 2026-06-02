import { useState } from 'react'
import type { VehicleGPSHistoryViewState } from './VehicleGPSHistory.types'

export function useVehicleGPSHistory(): VehicleGPSHistoryViewState {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { loading, error }
}
