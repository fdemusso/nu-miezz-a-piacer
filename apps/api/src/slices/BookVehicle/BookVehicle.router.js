"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookVehicleRouter = createBookVehicleRouter;
const express_1 = require("express");
const BookVehicle_handler_1 = require("./BookVehicle.handler");
function createBookVehicleRouter(deps) {
    const router = (0, express_1.Router)();
    router.post('/', (0, BookVehicle_handler_1.createBookVehicleHandler)(deps));
    return router;
}
