import type { IMaintenanceService } from '@vsa/contracts'
import type { ReceiveMalfunctionReportRequest, ReceiveMalfunctionReportResponse } from './ReceiveMalfunctionReport.types'

export function makeReceiveMalfunctionReportHandler(deps: {
  maintenanceService: IMaintenanceService
}) {
  return async function receiveMalfunctionReportHandler(
    _req: ReceiveMalfunctionReportRequest
  ): Promise<ReceiveMalfunctionReportResponse> {
    const queue = await deps.maintenanceService.getQueue()
    const reports = queue.filter(r => r.severity === 'medium' || r.severity === 'high')
    return { reports }
  }
}
