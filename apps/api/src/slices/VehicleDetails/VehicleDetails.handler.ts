import type { IVehicleRepository } from '@vsa/contracts'
import type { VehicleDetailsRequest, VehicleDetailsResponse } from './VehicleDetails.types'

export function makeVehicleDetailsHandler(deps: {
  vehicleRepo: IVehicleRepository
}) {
  return async function vehicleDetailsHandler(
    req: VehicleDetailsRequest
  ): Promise<VehicleDetailsResponse> {
    return {} as VehicleDetailsResponse
  }
}
