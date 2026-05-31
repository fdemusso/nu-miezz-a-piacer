import { useState } from 'react'
import type { ReportDamagedVehicleViewState } from './ReportDamagedVehicle.types'

export function useReportDamagedVehicle(): ReportDamagedVehicleViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
