import type { IVehicleRepository, IRoutingService } from '@vsa/contracts'
import type { EstimateWalkTimeRequest, EstimateWalkTimeResponse } from './EstimateWalkTime.types'

export function makeEstimateWalkTimeHandler(deps: {
  vehicleRepo: IVehicleRepository
  routingService: IRoutingService
}) {
  return async function estimateWalkTimeHandler(
    req: EstimateWalkTimeRequest
  ): Promise<EstimateWalkTimeResponse> {
    const vehicle = await deps.vehicleRepo.findById(req.vehicleId)
    if (!vehicle) throw Object.assign(new Error('Vehicle not found'), { status: 404 })
    const from = { lat: parseFloat(req.fromLat), lng: parseFloat(req.fromLng) }
    return deps.routingService.estimateWalk(from, vehicle.position)
  }
}
