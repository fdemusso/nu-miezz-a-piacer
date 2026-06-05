import { Request, Response } from 'express';
import { NearbyVehiclesDeps } from './NearbyVehicles.types';
export declare function createNearbyVehiclesHandler(deps: NearbyVehiclesDeps): (req: Request, res: Response) => Promise<void>;
