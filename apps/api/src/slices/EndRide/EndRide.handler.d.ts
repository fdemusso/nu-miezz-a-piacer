import { Request, Response } from 'express';
import { EndRideDeps } from './EndRide.types';
export declare function createEndRideHandler(deps: EndRideDeps): (req: Request, res: Response) => Promise<void>;
