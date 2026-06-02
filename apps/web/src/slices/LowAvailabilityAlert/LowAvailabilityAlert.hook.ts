import { useState } from 'react'
import type { LowAvailabilityAlertViewState } from './LowAvailabilityAlert.types'

export function useLowAvailabilityAlert(): LowAvailabilityAlertViewState {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { loading, error }
}
