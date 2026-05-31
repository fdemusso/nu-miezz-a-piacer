import { useState } from 'react'
import type { SuggestBestVehicleViewState } from './SuggestBestVehicle.types'

export function useSuggestBestVehicle(): SuggestBestVehicleViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
