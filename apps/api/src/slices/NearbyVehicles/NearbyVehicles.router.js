"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNearbyVehiclesRouter = createNearbyVehiclesRouter;
const express_1 = require("express");
const NearbyVehicles_handler_1 = require("./NearbyVehicles.handler");
function createNearbyVehiclesRouter(deps) {
    const router = (0, express_1.Router)();
    router.get('/nearby', (0, NearbyVehicles_handler_1.createNearbyVehiclesHandler)(deps));
    return router;
}
