import { ExportModel, OrderModel } from '@prisma/client';
import { OrderCreateDto } from './dto/order-create.dto';
import { ExportIdCreateDto } from './dto/exportId-create.dto';
import { NextFunction, Request, Response } from 'express';

export interface IOrdersService {
	createExportId: (exportId: ExportIdCreateDto) => Promise<ExportModel | null>;
	createOrder: (order: OrderCreateDto) => Promise<OrderModel | null>;
	updateOrder: (order: OrderCreateDto) => Promise<OrderModel | null>;
	requestExportId: () => Promise<void>;
}
