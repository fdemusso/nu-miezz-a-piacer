import { useState } from 'react'
import type { PauseRideViewState } from './PauseRide.types'

export function usePauseRide(): PauseRideViewState {
  const [status] = useState<PauseRideViewState['status']>('idle')
  return { status }
}
