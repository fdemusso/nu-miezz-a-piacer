import { useState } from 'react'
import type { UnlockVehicleViewState } from './UnlockVehicle.types'

export function useUnlockVehicle(): UnlockVehicleViewState {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { loading, error }
}
