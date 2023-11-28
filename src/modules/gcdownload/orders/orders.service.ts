import { inject, injectable } from 'inversify';
import { ApiResponse, IOrdersService } from './orders.service.interface';
import { IConfigService } from '../../../config/config.service.interface';
import { TYPES } from '../../../types';
import { ExportIdCreateDto } from './dto/exportId-create.dto';
import { OrderCreateDto } from './dto/order-create.dto';
import { ExportModel, OrderModel } from '@prisma/client';
import { Request, Response, NextFunction, response } from 'express';
import axios, { Axios, AxiosResponse } from 'axios';
import fs from 'fs';
import { ILogger } from '../../../logger/logger.interface';
import { IOrdersRepository } from './orders.repository.interface';
import { ExportId } from './orders.exportid.entity';

@injectable()
export class OrdersService implements IOrdersService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.OrdersRepository) private ordersRepository: IOrdersRepository,
	) {}
	async createExportId(maxRetries: number, delayMs: number): Promise<number | null> {
		// создать запрос на новый export ID
		// - аксиосом сделать запрос в геткурс через апи ключ
		// - ответ JSON сохранить в БД
		try {
			console.log('Запрос на геткурс');
			const response = await this.requestExportId();
			if (!response.data.success) {
				if (maxRetries > 0) {
					await new Promise((resolve) => setTimeout(resolve, delayMs));
					console.log(new Date(), 'Retry ', maxRetries - 1);
					return this.createExportId(maxRetries - 1, delayMs);
				} else {
					throw new Error('Max retries exceeded');
					return null;
				}
			}
			console.log('Получили данные');
			const data = response.data;
			console.log(data);
			const newExport = new ExportId(
				'Экспорт заказов Азат',
				data.info.export_id,
				'readytoexport',
				new Date(),
				new Date(),
			);
			console.log(newExport);
			console.log('Создаем выгрузку в БД');
			return data.info.export_id;
		} catch (error) {
			throw new Error('Max retries exceeded');
		}

		// fs.writeFile('response.json', JSON.stringify(response.data), (err) => {
		// 	if (err) {
		// 		console.error('Ошибка при записи в файл: ', err);
		// 	} else {
		// 		console.log('Ответ успешно сохранен в файл response.json');
		// 	}
		// });

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
	async requestExportId(): Promise<AxiosResponse> {
		try {
			const apiKey = this.configService.get('GC_API_KEY');
			const PREFIX = this.configService.get('GC_PREFIX');
			const now = new Date();
			const quarterAgo = new Date(now);
			quarterAgo.setMonth(quarterAgo.getDate() - 1);
			const agoDateGc = quarterAgo.toISOString().split('T')[0];
			const nowDateGc = now.toISOString().split('T')[0];
			const result = await axios.get(
				`${PREFIX}/deals/?key=${apiKey}&created_at[from]=${agoDateGc}&created_at[to]=${nowDateGc}`,
			);
			// console.log(result);
			return result;
		} catch (error) {
			console.error('An error occurred in requestExportId:', error);
			throw error;
		}
	}
	async requestExportData(): Promise<AxiosResponse> {
		
	}
}
