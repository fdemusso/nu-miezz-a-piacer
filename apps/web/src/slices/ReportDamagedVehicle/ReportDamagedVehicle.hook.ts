import { useState } from 'react'
import type { ReportDamagedVehicleViewState } from './ReportDamagedVehicle.types'

export function useReportDamagedVehicle(): ReportDamagedVehicleViewState {
  const [status] = useState<ReportDamagedVehicleViewState['status']>('idle')
  return { status }
}
