import { useState } from 'react'
import type { VehicleDetailsViewState } from './VehicleDetails.types'

export function useVehicleDetails(): VehicleDetailsViewState {
  const [status] = useState<VehicleDetailsViewState['status']>('idle')
  return { status }
}
