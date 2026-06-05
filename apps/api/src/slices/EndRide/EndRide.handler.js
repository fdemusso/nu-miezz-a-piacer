"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEndRideHandler = createEndRideHandler;
const contracts_1 = require("@mvp/contracts");
function createEndRideHandler(deps) {
    return async (req, res) => {
        const rideId = req.params['rideId'];
        const { userId, endLat, endLng, distanceKm } = req.body;
        const ride = await deps.rideRepo.findById(rideId);
        if (!ride || ride.userId !== userId || ride.status !== contracts_1.RideStatus.ACTIVE) {
            res.status(404).json({ error: 'Active ride not found' });
            return;
        }
        const { valid } = await deps.zoneValidator.isInParkingZone({ lat: endLat, lng: endLng });
        if (!valid) {
            res.status(422).json({ error: 'Must end ride in a valid parking zone' });
            return;
        }
        const vehicle = await deps.vehicleRepo.findById(ride.vehicleId);
        if (!vehicle) {
            res.status(500).json({ error: 'Vehicle not found' });
            return;
        }
        const endedAt = new Date();
        const durationMinutes = (endedAt.getTime() - ride.startedAt.getTime()) / 60000;
        const totalCost = await deps.billingService.calculateRideCost(ride.startedAt, endedAt, distanceKm, vehicle.pricing);
        const endedRide = await deps.rideRepo.end(rideId, {
            endedAt,
            endLocation: { lat: endLat, lng: endLng },
            distanceKm,
            durationMinutes,
            totalCost,
        });
        await deps.vehicleRepo.updateStatus(ride.vehicleId, contracts_1.VehicleStatus.AVAILABLE);
        await deps.vehicleRepo.updateLocation(ride.vehicleId, { lat: endLat, lng: endLng });
        res.json({ ride: endedRide, totalCost });
    };
}
