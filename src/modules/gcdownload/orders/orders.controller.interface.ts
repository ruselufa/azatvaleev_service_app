import { NextFunction, Request, Response } from 'express';

export interface IOrdersControllerInterface {
	requireExportId: () => void;
	exportOrders: () => void;
}
