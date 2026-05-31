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
    return {} as BookVehicleResponse
  }
}
