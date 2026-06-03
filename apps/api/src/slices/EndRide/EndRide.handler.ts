import type { IRideRepository, IVehicleRepository, IZoneRepository, IZoneValidator, IPricingService, IBillingService, IIncentiveService, INotificationSender } from '@vsa/contracts'
import type { EndRideRequest, EndRideResponse } from './EndRide.types'

export function makeEndRideHandler(deps: {
  rideRepo: IRideRepository
  vehicleRepo: IVehicleRepository
  zoneRepo: IZoneRepository
  zoneValidator: IZoneValidator
  pricingService: IPricingService
  billingService: IBillingService
  incentiveService: IIncentiveService
  notificationSender: INotificationSender
}) {
  return async function endRideHandler(
    req: EndRideRequest
  ): Promise<EndRideResponse> {
    const { userId, endLat, endLng } = req

    const ride = await deps.rideRepo.findActiveByUser(userId)
    if (!ride) throw Object.assign(new Error('Active ride not found'), { status: 404 })

    const vehicle = await deps.vehicleRepo.findById(ride.vehicleId)
    if (!vehicle) throw Object.assign(new Error('Vehicle not found'), { status: 404 })

    const endPosition = { lat: endLat, lng: endLng }

    const zones = await deps.zoneRepo.findAll()

    const validation = deps.zoneValidator.validate(endPosition, zones)
    if (!validation.valid) {
      throw Object.assign(new Error(validation.reason ?? 'Invalid parking position'), { status: 422 })
    }

    const durationSeconds = (Date.now() - ride.startedAt.getTime()) / 1000
    const cost = await deps.pricingService.estimateCost(vehicle, durationSeconds)

    await deps.billingService.charge(userId, cost.estimatedTotal)

    const incentiveZone = zones.find(
      z => z.type === 'incentive' && deps.zoneValidator.isInsideZone(endPosition, z)
    )
    if (incentiveZone) {
      await deps.incentiveService.applyParkingBonus(userId, incentiveZone.id)
    }

    // MVP: no lock call — vehicle becomes available directly
    ride.endedAt = new Date()
    ride.endPosition = endPosition
    ride.cost = cost.estimatedTotal

    vehicle.status = 'available'
    vehicle.position = endPosition

    await deps.rideRepo.save(ride)
    await deps.vehicleRepo.save(vehicle)

    await deps.notificationSender.send(
      userId,
      'Corsa terminata',
      `Totale: €${cost.estimatedTotal.amount}`
    )

    return { rideId: ride.id, cost }
  }
}
