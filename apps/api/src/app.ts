import express from 'express';
import cors from 'cors';
import { errorHandler, notFound } from './shared/middleware/errorHandler';
import { createCompositionRoot } from './composition-root';

export function createApp(): express.Express {
  const app = express();
  const root = createCompositionRoot();

  app.use(cors());
  app.use(express.json());

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Mount slice routers
  app.use('/api/vehicles', root.nearbyVehiclesRouter);
  app.use('/api/vehicles', root.searchRouter);
  app.use('/api/vehicles', root.vehicleDetailsRouter);
  app.use('/api/bookings', root.bookVehicleRouter);
  app.use('/api/rides', root.unlockVehicleRouter);
  app.use('/api/rides', root.endRideRouter);
  app.use('/api/rides', root.pauseRideRouter);
  app.use('/api/session', root.restoreSessionRouter);
  app.use('/api/profile', root.profileRouter);
  app.use('/api/history', root.historyRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
