import type { IVehicleRepository, IRoutingService } from '@vsa/contracts'
import type { EstimateWalkTimeRequest, EstimateWalkTimeResponse } from './EstimateWalkTime.types'

export function makeEstimateWalkTimeHandler(deps: {
  vehicleRepo: IVehicleRepository
  routingService: IRoutingService
}) {
  return async function estimateWalkTimeHandler(
    req: EstimateWalkTimeRequest
  ): Promise<EstimateWalkTimeResponse> {
    return {} as EstimateWalkTimeResponse
  }
}
