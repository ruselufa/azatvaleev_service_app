import { NextFunction, Request, Response } from 'express';

export interface IUsersEnkodControllerInterface {
	apiReceive: (req: Request, res: Response, next: NextFunction) => void;
}
