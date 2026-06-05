import { useState } from 'react'
import type { ExpiredBookingsMonitorViewState } from './ExpiredBookingsMonitor.types'

export function useExpiredBookingsMonitor(): ExpiredBookingsMonitorViewState {
  const [status] = useState<ExpiredBookingsMonitorViewState['status']>('idle')
  return { status }
}
