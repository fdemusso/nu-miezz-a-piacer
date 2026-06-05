"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUnlockVehicleRouter = createUnlockVehicleRouter;
const express_1 = require("express");
const UnlockVehicle_handler_1 = require("./UnlockVehicle.handler");
function createUnlockVehicleRouter(deps) {
    const router = (0, express_1.Router)();
    router.post('/unlock', (0, UnlockVehicle_handler_1.createUnlockVehicleHandler)(deps));
    return router;
}
