import type { IVehicleRepository } from '@vsa/contracts'
import type { VehicleBatteryStatusRequest, VehicleBatteryStatusResponse } from './VehicleBatteryStatus.types'

export function makeVehicleBatteryStatusHandler(deps: {
  vehicleRepo: IVehicleRepository
}) {
  return async function vehicleBatteryStatusHandler(
    req: VehicleBatteryStatusRequest
  ): Promise<VehicleBatteryStatusResponse> {
    return {} as VehicleBatteryStatusResponse
  }
}
