import { Request, Response } from 'express';
import { UnlockVehicleDeps } from './UnlockVehicle.types';
export declare function createUnlockVehicleHandler(deps: UnlockVehicleDeps): (req: Request, res: Response) => Promise<void>;
