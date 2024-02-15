import { NextFunction, Response, Request, Router } from 'express';
import { SaleCreateDto } from './dto/sales-create.dto';

export interface IControllerId {
	path: string;
	func: (req: Request, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
}
