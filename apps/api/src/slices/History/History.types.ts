import type { IRideRepository, Ride } from '@mvp/contracts';

export interface HistoryInput {
  userId: string;
}

export interface HistoryOutput {
  rides: Ride[];
}

export interface HistoryDeps {
  rideRepo: IRideRepository;
}
