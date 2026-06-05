import { Request, Response } from 'express';
import { PauseRideDeps } from './PauseRide.types';
export declare function createPauseRideHandler(deps: PauseRideDeps): (req: Request, res: Response) => Promise<void>;
export declare function createResumeRideHandler(deps: PauseRideDeps): (req: Request, res: Response) => Promise<void>;
