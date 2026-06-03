import type { Vehicle } from '@vsa/contracts'

export interface VehicleDetailsRequest {
  vehicleId: string
}

export type VehicleDetailsResponse = Vehicle
