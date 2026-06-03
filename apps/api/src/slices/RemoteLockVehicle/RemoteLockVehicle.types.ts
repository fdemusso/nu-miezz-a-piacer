export interface RemoteLockVehicleRequest {
  vehicleId: string
  reason?: string
}

export interface RemoteLockVehicleResponse {
  vehicleId: string
  locked: boolean
}
