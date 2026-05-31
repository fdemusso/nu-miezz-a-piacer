import { useState } from 'react'
import type { EndRideViewState } from './EndRide.types'

export function useEndRide(): EndRideViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
