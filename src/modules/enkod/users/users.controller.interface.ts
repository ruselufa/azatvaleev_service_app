import { NextFunction, Request, Response } from 'express';
import { UserCreateDto } from './dto/user-create.dto';

export interface IUsersEnkodControllerInterface {
	apiReceive: (req: Request, res: Response, next: NextFunction) => void;
	apiSend: (transferObject: UserCreateDto) => void;
}
