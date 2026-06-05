"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookVehicleHandler = createBookVehicleHandler;
const config_1 = require("@mvp/config");
const contracts_1 = require("@mvp/contracts");
function createBookVehicleHandler(deps) {
    return async (req, res) => {
        const { userId, vehicleId } = req.body;
        if (!userId || !vehicleId) {
            res.status(400).json({ error: 'userId and vehicleId are required' });
            return;
        }
        const vehicle = await deps.vehicleRepo.findById(vehicleId);
        if (!vehicle || vehicle.status !== contracts_1.VehicleStatus.AVAILABLE) {
            res.status(409).json({ error: 'Vehicle not available' });
            return;
        }
        const existing = await deps.bookingRepo.findActiveByUserId(userId);
        if (existing) {
            res.status(409).json({ error: 'User already has an active booking' });
            return;
        }
        const now = new Date();
        const expiresAt = new Date(now.getTime() + config_1.BOOKING_EXPIRY_MINUTES * 60 * 1000);
        const booking = await deps.bookingRepo.create({
            userId,
            vehicleId,
            status: contracts_1.BookingStatus.CONFIRMED,
            expiresAt,
            confirmedAt: now,
        });
        await deps.vehicleRepo.updateStatus(vehicleId, contracts_1.VehicleStatus.RESERVED);
        res.status(201).json({ booking });
    };
}
