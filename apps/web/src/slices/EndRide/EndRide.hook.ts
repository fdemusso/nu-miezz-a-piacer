import { useState } from 'react'
import type { EndRideViewState } from './EndRide.types'

export function useEndRide(): EndRideViewState {
  const [status] = useState<EndRideViewState['status']>('idle')
  return { status }
}
