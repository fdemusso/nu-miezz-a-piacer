import { useState } from 'react'
import type { MaintenanceQueueViewState } from './MaintenanceQueue.types'

export function useMaintenanceQueue(): MaintenanceQueueViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
