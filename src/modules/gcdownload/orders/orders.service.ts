import { inject, injectable } from 'inversify';
import { IOrdersService } from './orders.service.interface';
import { IConfigService } from '../../../config/config.service.interface';
import { TYPES } from '../../../types';
import { ExportIdCreateDto } from './dto/exportId-create.dto';
import { OrderCreateDto } from './dto/order-create.dto';
import { ExportModel, OrderModel } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

@injectable()
export class OrdersService implements IOrdersService {
	constructor(@inject(TYPES.ConfigService) private configService: IConfigService) {}
	async createExportId(exportId: ExportIdCreateDto): Promise<ExportModel | null> {
		// создать запрос на новый export ID
		// - аксиосом сделать запрос в геткурс через апи ключ
		// - ответ JSON сохранить в БД
		// - сохранить отдельно айди выгрузки, если нет ошибок
		// - через 1 час сделать запрос на скачивание выгрузки - чтение из базы последнего айди
		// - сохранить ответ JSON в файл
		// - распарсить JSON в базу данных заказов, (нулевые закинуть в отдельную таблицу NullOrdersModel)
		// дождать вып функции и записать ответ в базу данных
		return null;
	}
	async createOrder(order: OrderCreateDto): Promise<OrderModel | null> {
		return null;
	}
	async updateOrder(order: OrderCreateDto): Promise<OrderModel | null> {
		return null;
	}
	async requestExportId(): Promise<void> {
		const apiKey = this.configService.get('GC_API_KEY');
		const PREFIX = this.configService.get('GC_PREFIX');
		const now = new Date();
		const parsedNow = {
			day: now.getDate(),
			month: now.getMonth(),
			year: now.getFullYear(),
		};
		const result = await axios.get(
			`${PREFIX}/deals/?key=${apiKey}&created_at[from]=2023-11-27&created_at[to]=2023-11-27`,
		);
		console.log(result);
		return;
	}
}
