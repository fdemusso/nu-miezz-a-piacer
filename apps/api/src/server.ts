import { initDb } from './db';
import { createApp } from './app';

const PORT = Number(process.env['PORT'] ?? 3001);

async function start() {
  await initDb();
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`[api] running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('[api] startup failed:', err);
  process.exit(1);
});
