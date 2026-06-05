"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRestoreSessionHandler = createRestoreSessionHandler;
const contracts_1 = require("@mvp/contracts");
const ACTIVE_BOOKING_STATUSES = new Set([
    contracts_1.BookingStatus.PENDING,
    contracts_1.BookingStatus.CONFIRMED,
    contracts_1.BookingStatus.ACTIVE,
]);
function createRestoreSessionHandler(deps) {
    return async (req, res) => {
        const userId = req.query['userId'];
        if (!userId) {
            res.status(400).json({ error: 'userId required' });
            return;
        }
        const [ride, booking] = await Promise.all([
            deps.rideRepo.findActiveByUserId(userId),
            deps.bookingRepo.findActiveByUserId(userId),
        ]);
        const activeRide = ride && (ride.status === contracts_1.RideStatus.ACTIVE || ride.status === contracts_1.RideStatus.PAUSED)
            ? ride
            : null;
        const activeBooking = booking && ACTIVE_BOOKING_STATUSES.has(booking.status)
            ? booking
            : null;
        const vehicleId = activeRide?.vehicleId ?? activeBooking?.vehicleId ?? null;
        const vehicle = vehicleId ? await deps.vehicleRepo.findById(vehicleId) : null;
        res.json({ ride: activeRide, booking: activeBooking, vehicle });
    };
}
