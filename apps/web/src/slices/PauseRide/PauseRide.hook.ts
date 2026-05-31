import { useState } from 'react'
import type { PauseRideViewState } from './PauseRide.types'

export function usePauseRide(): PauseRideViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
