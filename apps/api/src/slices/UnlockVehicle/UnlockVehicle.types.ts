import type { UnlockMethodType } from '@vsa/contracts'

export interface UnlockVehicleRequest {
  userId: string
  bookingId: string
  method: UnlockMethodType
}

export interface UnlockVehicleResponse {
  rideId: string
}
