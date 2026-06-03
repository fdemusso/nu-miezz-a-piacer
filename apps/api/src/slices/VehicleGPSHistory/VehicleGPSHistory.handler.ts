import type { IGpsTrackingService } from '@vsa/contracts'
import type { VehicleGPSHistoryRequest, VehicleGPSHistoryResponse } from './VehicleGPSHistory.types'

export function makeVehicleGPSHistoryHandler(deps: {
  gpsTrackingService: IGpsTrackingService
}) {
  return async function vehicleGPSHistoryHandler(
    req: VehicleGPSHistoryRequest
  ): Promise<VehicleGPSHistoryResponse> {
    const { vehicleId, from: fromStr, to: toStr } = req
    const from = new Date(fromStr)
    const to = new Date(toStr)

    const history = await deps.gpsTrackingService.getHistory(vehicleId, { from, to })

    return { vehicleId, history }
  }
}
