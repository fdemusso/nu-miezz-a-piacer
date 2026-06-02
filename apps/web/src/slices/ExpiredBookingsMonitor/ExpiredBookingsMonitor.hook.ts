import { useState } from 'react'
import type { ExpiredBookingsMonitorViewState } from './ExpiredBookingsMonitor.types'

export function useExpiredBookingsMonitor(): ExpiredBookingsMonitorViewState {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { loading, error }
}
