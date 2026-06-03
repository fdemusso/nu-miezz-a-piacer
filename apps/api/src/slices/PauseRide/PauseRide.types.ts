export interface PauseRideRequest {
  userId: string
}

export interface PauseRideResponse {
  rideId: string
  paused: boolean
}
