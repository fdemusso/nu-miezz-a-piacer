import type { IGpsTrackingService } from '@vsa/contracts'
import type { VehicleGPSHistoryRequest, VehicleGPSHistoryResponse } from './VehicleGPSHistory.types'

export function makeVehicleGPSHistoryHandler(deps: {
  gpsTrackingService: IGpsTrackingService
}) {
  return async function vehicleGPSHistoryHandler(
    req: VehicleGPSHistoryRequest
  ): Promise<VehicleGPSHistoryResponse> {
    return {} as VehicleGPSHistoryResponse
  }
}
