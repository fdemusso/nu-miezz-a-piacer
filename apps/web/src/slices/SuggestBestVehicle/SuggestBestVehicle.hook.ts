import { useState } from 'react'
import type { SuggestBestVehicleViewState } from './SuggestBestVehicle.types'

export function useSuggestBestVehicle(): SuggestBestVehicleViewState {
  const [status] = useState<SuggestBestVehicleViewState['status']>('idle')
  return { status }
}
