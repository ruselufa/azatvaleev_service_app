import { ExportModel, NullOrderModel, OrderModel } from '@prisma/client';
import { ExportId } from './orders.exportid.entity';
import { Order } from './orders.entity';

export interface IOrdersRepository {
	createExportIdDb: (exportId: ExportId) => Promise<ExportModel>;
	findExportIdDb: (gcId: number) => Promise<ExportModel | null>;
	createOrderDb: (order: Order) => Promise<OrderModel>;
	updateOrderDb: (id: number, order: Order) => Promise<OrderModel>;
	findOrderDb: (idSystemGc: number) => Promise<OrderModel | null>;
	createNullOrderDb: (order: Order) => Promise<NullOrderModel>;
	updateNullOrderDb: (id: number, order: Order) => Promise<NullOrderModel>;
	findNullOrderDb: (idSystemGc: number) => Promise<NullOrderModel | null>;
}
