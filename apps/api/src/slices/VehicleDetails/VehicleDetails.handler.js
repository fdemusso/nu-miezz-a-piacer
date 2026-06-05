"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVehicleDetailsHandler = createVehicleDetailsHandler;
function createVehicleDetailsHandler(deps) {
    return async (req, res) => {
        const { vehicleId } = req.params;
        const vehicle = await deps.vehicleRepo.findById(vehicleId);
        if (!vehicle) {
            res.status(404).json({ error: 'Vehicle not found' });
            return;
        }
        res.json({ vehicle });
    };
}
