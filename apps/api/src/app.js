"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_1 = require("./shared/middleware/errorHandler");
const composition_root_1 = require("./composition-root");
function createApp() {
    const app = (0, express_1.default)();
    const root = (0, composition_root_1.createCompositionRoot)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    // Health check
    app.get('/health', (_req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    // Mount slice routers
    app.use('/api/vehicles', root.nearbyVehiclesRouter);
    app.use('/api/vehicles', root.vehicleDetailsRouter);
    app.use('/api/bookings', root.bookVehicleRouter);
    app.use('/api/rides', root.unlockVehicleRouter);
    app.use('/api/rides', root.endRideRouter);
    app.use('/api/rides', root.pauseRideRouter);
    app.use('/api/session', root.restoreSessionRouter);
    app.use(errorHandler_1.notFound);
    app.use(errorHandler_1.errorHandler);
    return app;
}
