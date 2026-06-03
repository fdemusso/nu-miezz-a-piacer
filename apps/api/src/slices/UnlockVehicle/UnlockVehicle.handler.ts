import type { IUnlockService, IBookingRepository, IRideRepository, IVehicleRepository } from '@vsa/contracts'
import type { UnlockVehicleRequest, UnlockVehicleResponse } from './UnlockVehicle.types'

export function makeUnlockVehicleHandler(deps: {
  unlockService: IUnlockService
  bookingRepo: IBookingRepository
  rideRepo: IRideRepository
  vehicleRepo: IVehicleRepository
}) {
  return async function unlockVehicleHandler(
    req: UnlockVehicleRequest
  ): Promise<UnlockVehicleResponse> {
    const { userId, bookingId, method } = req

    const booking = await deps.bookingRepo.findById(bookingId)
    if (!booking) throw Object.assign(new Error('Booking not found'), { status: 404 })
    if (booking.status === 'expired') throw Object.assign(new Error('BOOKING_EXPIRED'), { status: 410 })
    if (booking.userId !== userId) throw Object.assign(new Error('FORBIDDEN'), { status: 403 })

    const vehicle = await deps.vehicleRepo.findById(booking.vehicleId)
    if (!vehicle) throw Object.assign(new Error('Vehicle not found'), { status: 404 })

    await deps.unlockService.unlock(vehicle.id, method)

    booking.status = 'converted'
    vehicle.status = 'in_use'

    const ride = {
      id: crypto.randomUUID(),
      userId: booking.userId,
      vehicleId: vehicle.id,
      startedAt: new Date(),
      startPosition: vehicle.position,
      paused: false,
    }

    await deps.vehicleRepo.save(vehicle)
    await deps.bookingRepo.save(booking)
    await deps.rideRepo.save(ride)

    return { rideId: ride.id }
  }
}
