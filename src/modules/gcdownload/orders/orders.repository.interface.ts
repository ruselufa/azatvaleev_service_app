import { ExportModel, NullOrderModel, OrderModel } from '@prisma/client';
import { ExportId } from './orders.exportid.entity';
import { Order } from './orders.entity';

export interface IOrdersRepository {
	// Работа с таблицей ExportID
	createExportIdDb: (exportId: ExportId) => Promise<ExportModel>;
	findExportIdDb: (gcId: number) => Promise<ExportModel | null>;
	findStatusExportId: (status: string) => Promise<ExportModel[] | []>;
	updateStatusExportId: (id: number, status: string) => Promise<ExportModel>;
	// Работа с таблицей заказов
	createOrderDb: (order: Order) => Promise<OrderModel>;
	updateOrderDb: (id: number, order: Order) => Promise<OrderModel>;
	findOrderDb: (idSystemGc: number) => Promise<OrderModel | null>;
	// Работа с таблицей нулевых заказов
	createNullOrderDb: (order: Order) => Promise<NullOrderModel>;
	updateNullOrderDb: (id: number, order: Order) => Promise<NullOrderModel>;
	findNullOrderDb: (idSystemGc: number) => Promise<NullOrderModel | null>;
}
