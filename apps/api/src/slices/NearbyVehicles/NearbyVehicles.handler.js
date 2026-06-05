"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNearbyVehiclesHandler = createNearbyVehiclesHandler;
const config_1 = require("@mvp/config");
function haversineMeters(a, b) {
    const R = 6371000;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const x = Math.sin(dLat / 2) ** 2 +
        Math.cos((a.lat * Math.PI) / 180) *
            Math.cos((b.lat * Math.PI) / 180) *
            Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}
function createNearbyVehiclesHandler(deps) {
    return async (req, res) => {
        const lat = Number(req.query['lat']);
        const lng = Number(req.query['lng']);
        const radiusKm = Number(req.query['radiusKm'] ?? config_1.DEFAULT_SEARCH_RADIUS_KM);
        if (isNaN(lat) || isNaN(lng)) {
            res.status(400).json({ error: 'lat and lng are required' });
            return;
        }
        const userPosition = { lat, lng };
        const rawVehicles = await deps.vehicleRepo.findNearby(userPosition, radiusKm);
        const items = rawVehicles
            .slice(0, config_1.MAX_NEARBY_VEHICLES)
            .map((v) => {
            const distanceMeters = Math.round(haversineMeters(userPosition, v.location));
            const estimatedWalkMinutes = Math.ceil(distanceMeters / 83);
            return {
                id: v.id,
                plateOrCode: v.licensePlate ?? `${v.type}-${v.id.slice(-3).toUpperCase()}`,
                type: v.type,
                status: v.status,
                batteryLevel: v.battery.level,
                distanceMeters,
                estimatedWalkMinutes,
                currentPosition: v.location,
            };
        });
        res.json({ userPosition, radiusKm, vehicles: items });
    };
}
