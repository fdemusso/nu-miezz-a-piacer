import { useState } from 'react'
import type { VerifyParkingPositionViewState } from './VerifyParkingPosition.types'

export function useVerifyParkingPosition(): VerifyParkingPositionViewState {
  const [status] = useState<VerifyParkingPositionViewState['status']>('idle')
  return { status }
}
