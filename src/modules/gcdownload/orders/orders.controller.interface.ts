import { NextFunction, Request, Response } from 'express';

export interface IOrdersControllerInterface {
	startCronJob: () => void;
}
