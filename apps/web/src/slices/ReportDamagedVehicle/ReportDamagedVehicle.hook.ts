import { useState } from 'react'
import type { ReportDamagedVehicleViewState } from './ReportDamagedVehicle.types'

export function useReportDamagedVehicle(): ReportDamagedVehicleViewState {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { loading, error }
}
