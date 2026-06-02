import { useState } from 'react'
import type { SuggestBestVehicleViewState } from './SuggestBestVehicle.types'

export function useSuggestBestVehicle(): SuggestBestVehicleViewState {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { loading, error }
}
