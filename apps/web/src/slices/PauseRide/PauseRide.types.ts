export interface UsePauseRideResult {
  pauseRide: (rideId: string, userId: string) => Promise<void>;
  resumeRide: (rideId: string, userId: string) => Promise<void>;
  isPausing: boolean;
  isResuming: boolean;
  error: Error | null;
}
