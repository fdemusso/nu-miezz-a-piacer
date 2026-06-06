"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSearchHandler = createSearchHandler;
function createSearchHandler(deps) {
    return async (input) => {
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
