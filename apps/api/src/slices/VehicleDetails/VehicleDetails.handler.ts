import type { IVehicleRepository } from '@vsa/contracts'
import type { VehicleDetailsRequest, VehicleDetailsResponse } from './VehicleDetails.types'

export function makeVehicleDetailsHandler(deps: { vehicleRepo: IVehicleRepository }) {
  return async function vehicleDetailsHandler(
    req: VehicleDetailsRequest
  ): Promise<VehicleDetailsResponse> {
    const vehicle = await deps.vehicleRepo.findById(req.vehicleId)
    if (!vehicle) throw Object.assign(new Error('Vehicle not found'), { status: 404 })
    return vehicle
  }
}
