"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHistoryRouter = createHistoryRouter;
const express_1 = require("express");
const History_handler_1 = require("./History.handler");
function createHistoryRouter(deps) {
    const router = (0, express_1.Router)();
    const handler = (0, History_handler_1.createHistoryHandler)(deps);
    router.get('/', async (req, res) => {
        const userId = req.query['userId'];
        if (!userId) {
            res.status(400).json({ error: 'userId is required' });
            return;
        }
        try {
            const result = await handler({ userId });
            res.json(result);
        }
        catch (err) {
            const e = err;
            res.status(e.statusCode ?? 500).json({ error: e.message ?? 'Internal server error' });
        }
    });
    return router;
}
