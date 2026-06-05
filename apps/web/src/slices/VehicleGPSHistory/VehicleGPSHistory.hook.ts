import { useState } from 'react'
import type { VehicleGPSHistoryViewState } from './VehicleGPSHistory.types'

export function useVehicleGPSHistory(): VehicleGPSHistoryViewState {
  const [status] = useState<VehicleGPSHistoryViewState['status']>('idle')
  return { status }
}
