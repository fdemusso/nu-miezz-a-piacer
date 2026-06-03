import type { IVehicleRepository, IFleetZoneRepository, IZoneValidator } from '@vsa/contracts'
import type { FleetDistributionMapRequest, FleetDistributionMapResponse } from './FleetDistributionMap.types'

export function makeFleetDistributionMapHandler(deps: {
  vehicleRepo: IVehicleRepository
  fleetZoneRepo: IFleetZoneRepository
  zoneValidator: IZoneValidator
}) {
  return async function fleetDistributionMapHandler(
    _req: FleetDistributionMapRequest
  ): Promise<FleetDistributionMapResponse> {
    const vehicles = await deps.vehicleRepo.findAll()
    const zones = await deps.fleetZoneRepo.findAll()

    const result = zones.map(zone => {
      const zoneVehicles = vehicles.filter(v =>
        deps.zoneValidator.isInsideZone(v.position, zone)
      )
      return {
        zoneId: zone.id,
        name: zone.name,
        count: zoneVehicles.length,
        vehicles: zoneVehicles.map(v => ({
          id: v.id,
          type: v.type,
          status: v.status,
          batteryLevel: v.batteryLevel,
        })),
      }
    })

    return { zones: result }
  }
}
