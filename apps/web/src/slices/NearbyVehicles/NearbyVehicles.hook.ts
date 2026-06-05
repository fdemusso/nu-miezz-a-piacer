import { useState } from 'react'
import type { NearbyVehiclesViewState } from './NearbyVehicles.types'

export function useNearbyVehicles(): NearbyVehiclesViewState {
  const [status] = useState<NearbyVehiclesViewState['status']>('idle')
  return { status }
}
