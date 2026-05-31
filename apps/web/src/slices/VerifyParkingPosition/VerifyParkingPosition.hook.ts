import { useState } from 'react'
import type { VerifyParkingPositionViewState } from './VerifyParkingPosition.types'

export function useVerifyParkingPosition(): VerifyParkingPositionViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
