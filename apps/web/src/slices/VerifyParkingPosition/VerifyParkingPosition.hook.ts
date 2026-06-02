import { useState } from 'react'
import type { VerifyParkingPositionViewState } from './VerifyParkingPosition.types'

export function useVerifyParkingPosition(): VerifyParkingPositionViewState {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { loading, error }
}
