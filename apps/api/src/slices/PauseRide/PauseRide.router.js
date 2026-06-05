"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPauseRideRouter = createPauseRideRouter;
const express_1 = require("express");
const PauseRide_handler_1 = require("./PauseRide.handler");
function createPauseRideRouter(deps) {
    const router = (0, express_1.Router)();
    router.post('/:rideId/pause', (0, PauseRide_handler_1.createPauseRideHandler)(deps));
    router.post('/:rideId/resume', (0, PauseRide_handler_1.createResumeRideHandler)(deps));
    return router;
}
