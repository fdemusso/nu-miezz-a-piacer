"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUnlockVehicleHandler = createUnlockVehicleHandler;
const contracts_1 = require("@mvp/contracts");
function createUnlockVehicleHandler(deps) {
    return async (req, res) => {
        const { userId, bookingId, startLat, startLng } = req.body;
        if (!userId || !bookingId || startLat == null || startLng == null) {
            res.status(400).json({ error: 'userId, bookingId, startLat, startLng required' });
            return;
        }
        const booking = await deps.bookingRepo.findById(bookingId);
        if (!booking || booking.userId !== userId || booking.status !== contracts_1.BookingStatus.CONFIRMED) {
            res.status(404).json({ error: 'Valid confirmed booking not found' });
            return;
        }
        const inZone = await deps.zoneValidator.isInServiceZone({ lat: startLat, lng: startLng });
        if (!inZone) {
            res.status(422).json({ error: 'Location outside service zone' });
            return;
        }
        const ride = await deps.rideRepo.create({
            userId,
            vehicleId: booking.vehicleId,
            bookingId,
            status: contracts_1.RideStatus.ACTIVE,
            startedAt: new Date(),
            startLocation: { lat: startLat, lng: startLng },
        });
        const { success, unlockCode } = await deps.unlockService.unlock(booking.vehicleId, ride.id);
        if (!success) {
            res.status(502).json({ error: 'Failed to unlock vehicle' });
            return;
        }
        await deps.bookingRepo.updateStatus(bookingId, contracts_1.BookingStatus.CONVERTED_TO_RIDE);
        await deps.vehicleRepo.updateStatus(booking.vehicleId, contracts_1.VehicleStatus.IN_USE);
        res.status(201).json({ ride, unlockCode });
    };
}
