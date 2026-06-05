import type { Booking } from '@vsa/contracts'

export interface BookVehicleRequest {
  userId: string
  vehicleId: string
}

export interface BookVehicleResponse {
  booking: Booking
}

export interface CancelBookingRequest {
  bookingId: string
  userId: string
}

export interface CancelBookingResponse {
  booking: Booking
}

