"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHistoryHandler = createHistoryHandler;
function createHistoryHandler(deps) {
    return async (input) => {
        const rides = await deps.rideRepo.findByUserId(input.userId);
        return { rides };
    };
}
