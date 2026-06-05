import { useState } from 'react'
import type { LowAvailabilityAlertViewState } from './LowAvailabilityAlert.types'

export function useLowAvailabilityAlert(): LowAvailabilityAlertViewState {
  const [status] = useState<LowAvailabilityAlertViewState['status']>('idle')
  return { status }
}
