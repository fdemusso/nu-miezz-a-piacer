import type { IMaintenanceService } from '@vsa/contracts'
import type { MaintenanceQueueRequest, MaintenanceQueueResponse } from './MaintenanceQueue.types'

export function makeMaintenanceQueueHandler(deps: {
  maintenanceService: IMaintenanceService
}) {
  return async function maintenanceQueueHandler(
    _req: MaintenanceQueueRequest
  ): Promise<MaintenanceQueueResponse> {
    const queue = await deps.maintenanceService.getQueue()
    return { queue }
  }
}
