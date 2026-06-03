import type { IUserRepository, IVehicleRepository, IBookingRepository } from '@vsa/contracts'
import type { BookVehicleRequest, BookVehicleResponse } from './BookVehicle.types'

export function makeBookVehicleHandler(deps: {
  userRepo: IUserRepository
  vehicleRepo: IVehicleRepository
  bookingRepo: IBookingRepository
}) {
  return async function bookVehicleHandler(
    req: BookVehicleRequest
  ): Promise<BookVehicleResponse> {
    const { userId, vehicleId } = req

    const user = await deps.userRepo.findById(userId)
    if (!user) throw Object.assign(new Error('User not found'), { status: 404 })
    if (user.suspended) throw Object.assign(new Error('User is suspended'), { status: 403 })

    const vehicle = await deps.vehicleRepo.findById(vehicleId)
    if (!vehicle) throw Object.assign(new Error('Vehicle not found'), { status: 404 })
    if (vehicle.status !== 'available') {
      throw Object.assign(new Error('VEHICLE_UNAVAILABLE'), { status: 409 })
    }

    const activeBookings = await deps.bookingRepo.findActiveByUser(userId)
    if (activeBookings.length > 0) {
      throw Object.assign(new Error('USER_ALREADY_BOOKING'), { status: 409 })
    }

    const booking = {
      id: crypto.randomUUID(),
      userId,
      vehicleId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      status: 'active' as const,
    }

    vehicle.status = 'reserved'
    await deps.vehicleRepo.save(vehicle)
    await deps.bookingRepo.save(booking)

    return { booking }
  }
}
