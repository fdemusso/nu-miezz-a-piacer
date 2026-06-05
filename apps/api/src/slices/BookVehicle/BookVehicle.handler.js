"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCancelBookingHandler = createCancelBookingHandler;
exports.createBookVehicleHandler = createBookVehicleHandler;
const config_1 = require("@mvp/config");
const contracts_1 = require("@mvp/contracts");
const NON_CANCELLABLE = new Set([
    contracts_1.BookingStatus.CONVERTED_TO_RIDE,
    contracts_1.BookingStatus.CANCELLED,
    contracts_1.BookingStatus.EXPIRED,
]);
function createCancelBookingHandler(deps) {
    return async (req, res) => {
        const { id } = req.params;
        const booking = await deps.bookingRepo.findById(id);
        if (!booking) {
            res.status(404).json({ error: 'Booking not found' });
            return;
        }
        if (NON_CANCELLABLE.has(booking.status)) {
            res.status(409).json({ error: 'Booking cannot be cancelled' });
            return;
        }
        await deps.bookingRepo.updateStatus(id, contracts_1.BookingStatus.CANCELLED);
        await deps.vehicleRepo.updateStatus(booking.vehicleId, contracts_1.VehicleStatus.AVAILABLE);
        res.status(200).json({ ok: true });
    };
}
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
