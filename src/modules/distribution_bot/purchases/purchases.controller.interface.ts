import { NextFunction, Request, Response } from 'express';

export interface IPurchasesControllerInterface {
	apiReceive: (req: Request, res: Response, next: NextFunction) => void;
	apiReceiveAlina2Cake: (req: Request, res: Response, next: NextFunction) => void;
}
