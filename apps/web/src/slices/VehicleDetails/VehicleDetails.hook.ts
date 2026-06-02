import { useState } from 'react'
import type { VehicleDetailsViewState } from './VehicleDetails.types'

export function useVehicleDetails(): VehicleDetailsViewState {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { loading, error }
}
