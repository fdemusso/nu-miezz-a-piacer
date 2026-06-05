"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPauseRideHandler = createPauseRideHandler;
exports.createResumeRideHandler = createResumeRideHandler;
const contracts_1 = require("@mvp/contracts");
function createPauseRideHandler(deps) {
    return async (req, res) => {
        const rideId = req.params['rideId'];
        const { userId } = req.body;
        const ride = await deps.rideRepo.findById(rideId);
        if (!ride || ride.userId !== userId || ride.status !== contracts_1.RideStatus.ACTIVE) {
            res.status(404).json({ error: 'Active ride not found' });
            return;
        }
        await deps.rideRepo.updateStatus(rideId, contracts_1.RideStatus.PAUSED);
        // Vehicle stays IN_USE — still assigned to rider during pause
        await deps.vehicleRepo.updateStatus(ride.vehicleId, contracts_1.VehicleStatus.IN_USE);
        const updated = await deps.rideRepo.findById(rideId);
        res.json({ ride: updated });
    };
}
function createResumeRideHandler(deps) {
    return async (req, res) => {
        const rideId = req.params['rideId'];
        const { userId } = req.body;
        const ride = await deps.rideRepo.findById(rideId);
        if (!ride || ride.userId !== userId || ride.status !== contracts_1.RideStatus.PAUSED) {
            res.status(404).json({ error: 'Paused ride not found' });
            return;
        }
        await deps.rideRepo.updateStatus(rideId, contracts_1.RideStatus.ACTIVE);
        await deps.vehicleRepo.updateStatus(ride.vehicleId, contracts_1.VehicleStatus.IN_USE);
        const updated = await deps.rideRepo.findById(rideId);
        res.json({ ride: updated });
    };
}
