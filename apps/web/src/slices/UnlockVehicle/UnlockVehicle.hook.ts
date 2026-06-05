import { useState } from 'react'
import type { UnlockVehicleViewState } from './UnlockVehicle.types'

export function useUnlockVehicle(): UnlockVehicleViewState {
  const [status] = useState<UnlockVehicleViewState['status']>('idle')
  return { status }
}
