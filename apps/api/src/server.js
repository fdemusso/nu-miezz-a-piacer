"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const app_1 = require("./app");
const PORT = Number(process.env['PORT'] ?? 3001);
async function start() {
    await (0, db_1.initDb)();
    const app = (0, app_1.createApp)();
    app.listen(PORT, () => {
        console.log(`[api] running on http://localhost:${PORT}`);
    });
}
start().catch((err) => {
    console.error('[api] startup failed:', err);
    process.exit(1);
});
