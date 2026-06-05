import { Request, Response } from 'express';
import { BookVehicleDeps } from './BookVehicle.types';
export declare function createCancelBookingHandler(deps: BookVehicleDeps): (req: Request, res: Response) => Promise<void>;
export declare function createBookVehicleHandler(deps: BookVehicleDeps): (req: Request, res: Response) => Promise<void>;
