import type { IVehicleRepository, IGpsTrackingService, IFleetZoneRepository } from '@vsa/contracts'
import type { FleetDistributionMapRequest, FleetDistributionMapResponse } from './FleetDistributionMap.types'

export function makeFleetDistributionMapHandler(deps: {
  vehicleRepo: IVehicleRepository
  gpsTrackingService: IGpsTrackingService
  fleetZoneRepo: IFleetZoneRepository
}) {
  return async function fleetDistributionMapHandler(
    req: FleetDistributionMapRequest
  ): Promise<FleetDistributionMapResponse> {
    return {} as FleetDistributionMapResponse
  }
}
