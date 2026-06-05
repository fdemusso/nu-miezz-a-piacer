import { useState } from 'react'
import type { MaintenanceQueueViewState } from './MaintenanceQueue.types'

export function useMaintenanceQueue(): MaintenanceQueueViewState {
  const [status] = useState<MaintenanceQueueViewState['status']>('idle')
  return { status }
}
