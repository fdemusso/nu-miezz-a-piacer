import type { IRideRepository, IVehicleRepository } from '@vsa/contracts'
import type { RideSummaryRequest, RideSummaryResponse } from './RideSummary.types'

export function makeRideSummaryHandler(deps: {
  rideRepo: IRideRepository
  vehicleRepo: IVehicleRepository
}) {
  return async function rideSummaryHandler(
    req: RideSummaryRequest
  ): Promise<RideSummaryResponse> {
    return {} as RideSummaryResponse
  }
}
