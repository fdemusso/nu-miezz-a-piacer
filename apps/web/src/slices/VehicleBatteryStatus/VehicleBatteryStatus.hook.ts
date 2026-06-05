import { useState } from 'react'
import type { VehicleBatteryStatusViewState } from './VehicleBatteryStatus.types'

export function useVehicleBatteryStatus(): VehicleBatteryStatusViewState {
  const [status] = useState<VehicleBatteryStatusViewState['status']>('idle')
  return { status }
}
