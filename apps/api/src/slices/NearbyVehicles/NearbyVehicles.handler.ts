import { Request, Response } from 'express';
import { DEFAULT_SEARCH_RADIUS_KM, MAX_NEARBY_VEHICLES } from '@mvp/config';
import { NearbyVehiclesItem, Coordinates } from '@mvp/contracts';
import { NearbyVehiclesDeps } from './NearbyVehicles.types';

function haversineMeters(a: Coordinates, b: Coordinates): number {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export function createNearbyVehiclesHandler(deps: NearbyVehiclesDeps) {
  return async (req: Request, res: Response): Promise<void> => {
    const lat = Number(req.query['lat']);
    const lng = Number(req.query['lng']);
    const radiusKm = Number(req.query['radiusKm'] ?? DEFAULT_SEARCH_RADIUS_KM);

    if (isNaN(lat) || isNaN(lng)) {
      res.status(400).json({ error: 'lat and lng are required' });
      return;
    }

    const userPosition = { lat, lng };
    const rawVehicles = await deps.vehicleRepo.findNearby(userPosition, radiusKm);

    const items: NearbyVehiclesItem[] = rawVehicles
      .slice(0, MAX_NEARBY_VEHICLES)
      .map((v) => {
        const distanceMeters = Math.round(haversineMeters(userPosition, v.location));
        const estimatedWalkMinutes = Math.ceil(distanceMeters / 83);
        return {
          id: v.id,
          plateOrCode: v.licensePlate ?? `${v.type}-${v.id.slice(-3).toUpperCase()}`,
          type: v.type,
          status: v.status,
          batteryLevel: v.battery.level,
          distanceMeters,
          estimatedWalkMinutes,
          currentPosition: v.location,
        };
      });

    res.json({ userPosition, radiusKm, vehicles: items });
  };
}
