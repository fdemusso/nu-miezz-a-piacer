"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEndRideRouter = createEndRideRouter;
const express_1 = require("express");
const EndRide_handler_1 = require("./EndRide.handler");
function createEndRideRouter(deps) {
    const router = (0, express_1.Router)();
    router.post('/:rideId/end', (0, EndRide_handler_1.createEndRideHandler)(deps));
    return router;
}
