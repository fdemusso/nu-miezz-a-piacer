"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRestoreSessionRouter = createRestoreSessionRouter;
const express_1 = require("express");
const RestoreSession_handler_1 = require("./RestoreSession.handler");
function createRestoreSessionRouter(deps) {
    const router = (0, express_1.Router)();
    router.get('/', (0, RestoreSession_handler_1.createRestoreSessionHandler)(deps));
    return router;
}
