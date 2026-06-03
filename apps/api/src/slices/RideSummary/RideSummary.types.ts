import type { Ride, VehicleType } from '@vsa/contracts'

export interface RideSummaryRequest {
  rideId: string
}

export interface RideSummaryResponse {
  ride: Ride
  vehicleType: VehicleType
  vehiclePlate: string
  durationSeconds: number | null
}
