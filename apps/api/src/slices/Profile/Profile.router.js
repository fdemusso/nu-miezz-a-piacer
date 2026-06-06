"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProfileRouter = createProfileRouter;
const express_1 = require("express");
const Profile_handler_1 = require("./Profile.handler");
function createProfileRouter(deps) {
    const router = (0, express_1.Router)();
    const handler = (0, Profile_handler_1.createProfileHandler)(deps);
    router.get('/', async (req, res) => {
        const userId = req.query['userId'];
        if (!userId || typeof userId !== 'string') {
            res.status(400).json({ error: 'userId is required' });
            return;
        }
        try {
            const output = await handler({ userId });
            res.json(output);
        }
        catch (err) {
            const e = err;
            res.status(e.statusCode ?? 500).json({ error: e.message ?? 'Internal server error' });
        }
    });
    return router;
}
