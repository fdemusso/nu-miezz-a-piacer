"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVehicleDetailsRouter = createVehicleDetailsRouter;
const express_1 = require("express");
const VehicleDetails_handler_1 = require("./VehicleDetails.handler");
function createVehicleDetailsRouter(deps) {
    const router = (0, express_1.Router)();
    router.get('/:vehicleId', (0, VehicleDetails_handler_1.createVehicleDetailsHandler)(deps));
    return router;
}
