import { useState } from 'react'
import type { ExpiredBookingsMonitorViewState } from './ExpiredBookingsMonitor.types'

export function useExpiredBookingsMonitor(): ExpiredBookingsMonitorViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
