import type { IMaintenanceService, INotificationSender } from '@vsa/contracts'
import type { ReportDamagedVehicleRequest, ReportDamagedVehicleResponse } from './ReportDamagedVehicle.types'

export function makeReportDamagedVehicleHandler(deps: {
  maintenanceService: IMaintenanceService
  notificationSender: INotificationSender
}) {
  return async function reportDamagedVehicleHandler(
    req: ReportDamagedVehicleRequest
  ): Promise<ReportDamagedVehicleResponse> {
    return {} as ReportDamagedVehicleResponse
  }
}
