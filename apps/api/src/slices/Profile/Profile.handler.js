"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProfileHandler = createProfileHandler;
function createProfileHandler(deps) {
    return async (input) => {
        const user = await deps.userRepo.findById(input.userId);
        if (!user) {
            throw Object.assign(new Error('User not found'), { statusCode: 404 });
        }
        return { profile: user };
    };
}
