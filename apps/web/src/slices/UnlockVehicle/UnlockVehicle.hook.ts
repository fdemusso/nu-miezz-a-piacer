import { useState } from 'react'
import type { UnlockVehicleViewState } from './UnlockVehicle.types'

export function useUnlockVehicle(): UnlockVehicleViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
