import type { IVehicleRepository } from '@vsa/contracts'
import type { VehicleBatteryStatusRequest, VehicleBatteryStatusResponse } from './VehicleBatteryStatus.types'

export function makeVehicleBatteryStatusHandler(deps: { vehicleRepo: IVehicleRepository }) {
  return async function vehicleBatteryStatusHandler(
    req: VehicleBatteryStatusRequest
  ): Promise<VehicleBatteryStatusResponse> {
    const vehicle = await deps.vehicleRepo.findById(req.vehicleId)
    if (!vehicle) throw Object.assign(new Error('Vehicle not found'), { status: 404 })
    return {
      batteryLevel: vehicle.batteryLevel,
      estimatedRangeKm: vehicle.batteryLevel * 0.5,
    }
  }
}
