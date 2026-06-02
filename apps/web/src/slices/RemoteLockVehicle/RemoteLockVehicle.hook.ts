import { useState } from 'react'
import type { RemoteLockVehicleViewState } from './RemoteLockVehicle.types'

export function useRemoteLockVehicle(): RemoteLockVehicleViewState {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { loading, error }
}
