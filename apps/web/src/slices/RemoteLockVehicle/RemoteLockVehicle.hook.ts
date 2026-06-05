import { useState } from 'react'
import type { RemoteLockVehicleViewState } from './RemoteLockVehicle.types'

export function useRemoteLockVehicle(): RemoteLockVehicleViewState {
  const [status] = useState<RemoteLockVehicleViewState['status']>('idle')
  return { status }
}
