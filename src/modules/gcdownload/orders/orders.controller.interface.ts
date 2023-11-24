import { NextFunction, Request, Response } from 'express';

export interface IOrdersControllerInterface {
	apiRecieve: (req: Request, res: Response, next: NextFunction) => void;
}
