import type { IMaintenanceService } from '@vsa/contracts'
import type { MaintenanceQueueRequest, MaintenanceQueueResponse } from './MaintenanceQueue.types'

export function makeMaintenanceQueueHandler(deps: {
  maintenanceService: IMaintenanceService
}) {
  return async function maintenanceQueueHandler(
    req: MaintenanceQueueRequest
  ): Promise<MaintenanceQueueResponse> {
    return {} as MaintenanceQueueResponse
  }
}
