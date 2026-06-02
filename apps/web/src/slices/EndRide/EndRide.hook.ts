import { useState } from 'react'
import type { EndRideViewState } from './EndRide.types'

export function useEndRide(): EndRideViewState {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { loading, error }
}
