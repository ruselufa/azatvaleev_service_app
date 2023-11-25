import { ExportModel, OrderModel } from '@prisma/client';
import { OrderCreateDto } from './dto/order-create.dto';
import { ExportIdCreateDto } from './dto/exportId-create.dto';

export interface IOrdersService {
	createExportId: (exportId: ExportIdCreateDto) => Promise<ExportModel> | null;
	createOrder: (order: OrderCreateDto) => Promise<OrderModel> | null;
	updateOrder: (order: OrderCreateDto) => Promise<OrderModel> | null;
}
