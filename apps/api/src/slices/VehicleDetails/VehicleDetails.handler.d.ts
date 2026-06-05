import { Request, Response } from 'express';
import { VehicleDetailsDeps } from './VehicleDetails.types';
export declare function createVehicleDetailsHandler(deps: VehicleDetailsDeps): (req: Request, res: Response) => Promise<void>;
