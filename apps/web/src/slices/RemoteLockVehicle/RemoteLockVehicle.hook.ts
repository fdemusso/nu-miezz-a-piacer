import { useState } from 'react'
import type { RemoteLockVehicleViewState } from './RemoteLockVehicle.types'

export function useRemoteLockVehicle(): RemoteLockVehicleViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
