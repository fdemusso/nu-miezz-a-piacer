import type { SearchDeps, SearchInput, SearchOutput } from './Search.types';

export function createSearchHandler(deps: SearchDeps) {
  return async (input: SearchInput): Promise<SearchOutput> => {
    const vehicles = await deps.vehicleRepo.search(input.filters);

    const items = vehicles.map((v) => ({
      id: v.id,
      plateOrCode: v.licensePlate ?? `${v.type}-${v.id.slice(-3).toUpperCase()}`,
      type: v.type,
      status: v.status,
      model: v.model,
      batteryLevel: v.battery.level,
      estimatedRangeKm: v.battery.estimatedRangeKm,
    }));

    return { vehicles: items, total: items.length };
  };
}
