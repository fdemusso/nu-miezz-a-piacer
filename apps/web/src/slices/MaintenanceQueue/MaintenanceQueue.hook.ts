import { useState } from 'react'
import type { MaintenanceQueueViewState } from './MaintenanceQueue.types'

export function useMaintenanceQueue(): MaintenanceQueueViewState {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { loading, error }
}
