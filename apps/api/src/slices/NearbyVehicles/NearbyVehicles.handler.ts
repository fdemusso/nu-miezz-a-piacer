import { Request, Response } from 'express';
import { DEFAULT_SEARCH_RADIUS_KM, MAX_NEARBY_VEHICLES } from '@mvp/config';
import { NearbyVehiclesDeps } from './NearbyVehicles.types';

export function createNearbyVehiclesHandler(deps: NearbyVehiclesDeps) {
  return async (req: Request, res: Response): Promise<void> => {
    const lat = Number(req.query['lat']);
    const lng = Number(req.query['lng']);
    const radiusKm = Number(req.query['radiusKm'] ?? DEFAULT_SEARCH_RADIUS_KM);

    if (isNaN(lat) || isNaN(lng)) {
      res.status(400).json({ error: 'lat and lng are required' });
      return;
    }

    const vehicles = await deps.vehicleRepo.findNearby({ lat, lng }, radiusKm);
    const limited = vehicles.slice(0, MAX_NEARBY_VEHICLES);

    res.json({ vehicles: limited, userLocation: { lat, lng }, radiusKm });
  };
}
