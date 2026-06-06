import type { HistoryDeps, HistoryInput, HistoryOutput } from './History.types';

export function createHistoryHandler(deps: HistoryDeps) {
  return async (input: HistoryInput): Promise<HistoryOutput> => {
    const rides = await deps.rideRepo.findByUserId(input.userId);
    return { rides };
  };
}
