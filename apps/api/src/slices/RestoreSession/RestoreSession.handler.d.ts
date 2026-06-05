import { Request, Response } from 'express';
import { RestoreSessionDeps } from './RestoreSession.types';
export declare function createRestoreSessionHandler(deps: RestoreSessionDeps): (req: Request, res: Response) => Promise<void>;
