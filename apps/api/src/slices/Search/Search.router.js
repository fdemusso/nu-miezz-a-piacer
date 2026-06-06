"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSearchRouter = createSearchRouter;
const express_1 = require("express");
const contracts_1 = require("@mvp/contracts");
const Search_handler_1 = require("./Search.handler");
function createSearchRouter(deps) {
    const router = (0, express_1.Router)();
    const handler = (0, Search_handler_1.createSearchHandler)(deps);
    router.get('/search', async (req, res) => {
        const { query, type, onlyAvailable } = req.query;
        if (type !== undefined && !Object.values(contracts_1.VehicleType).includes(type)) {
            res.status(400).json({ error: `Invalid type. Valid values: ${Object.values(contracts_1.VehicleType).join(', ')}` });
            return;
        }
        try {
            const output = await handler({
                filters: {
                    query: typeof query === 'string' && query.trim() ? query.trim() : undefined,
                    type: type ? type : undefined,
                    onlyAvailable: onlyAvailable === 'true',
                },
            });
            res.json(output);
        }
        catch (err) {
            const e = err;
            res.status(e.statusCode ?? 500).json({ error: e.message ?? 'Internal server error' });
        }
    });
    return router;
}
