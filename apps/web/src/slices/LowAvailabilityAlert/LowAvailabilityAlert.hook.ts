import { useState } from 'react'
import type { LowAvailabilityAlertViewState } from './LowAvailabilityAlert.types'

export function useLowAvailabilityAlert(): LowAvailabilityAlertViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
