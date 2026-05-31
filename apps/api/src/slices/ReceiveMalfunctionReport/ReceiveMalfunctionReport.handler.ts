import type { IMaintenanceService } from '@vsa/contracts'
import type { ReceiveMalfunctionReportRequest, ReceiveMalfunctionReportResponse } from './ReceiveMalfunctionReport.types'

export function makeReceiveMalfunctionReportHandler(deps: {
  maintenanceService: IMaintenanceService
}) {
  return async function receiveMalfunctionReportHandler(
    req: ReceiveMalfunctionReportRequest
  ): Promise<ReceiveMalfunctionReportResponse> {
    return {} as ReceiveMalfunctionReportResponse
  }
}
