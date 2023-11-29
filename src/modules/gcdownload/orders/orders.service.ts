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
import { Order } from './orders.entity';

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
			await this.ordersRepository.createExportIdDb(newExport);
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
	async makeExport(exportId: number): Promise<AxiosResponse> {
		const apiKey = this.configService.get('GC_API_KEY');
		const PREFIX = this.configService.get('GC_PREFIX');
		const result = await axios.get(`${PREFIX}/exports/${exportId}?key=${apiKey}`);
		return result;
	}

	async writeExportData(data: AxiosResponse): Promise<OrderModel | null> {
		// получаем данные из makeExport
		const newData: string[][] = data.data.info.items;
		const arrOfObjects = newData.map((item) => {
			return {
				idSystemGc: Number(item[0]),
				idAzatGc: Number(item[1]),
				idUserGc: Number(item[2]),
				userName: item[3],
				userEmail: item[4],
				userPhone: item[5],
				createdAt: item[6],
				payedAt: item[7],
				orderName: item[8],
				dealStatus: item[9],
				price: Number(item[10]),
				payedPrice: Number(item[11]),
				payFee: Number(item[12]),
				income: Number(item[13]),
				taxes: Number(item[14]),
				profit: Number(item[15]),
				otherFee: Number(item[16]),
				netProfit: Number(item[17]),
				managerName: item[19],
				city: item[20],
				payedBy: item[21],
				promocodeUsed: item[23],
				promoCompany: item[24],
				utmSource: item[46],
				utmMedium: item[47],
				utmCampaign: item[48],
				utmContent: item[49],
				utmTerm: item[50],
				utmGroup: item[51],
				workWithOrder: item[25],
				orderComments: item[26],
				rejectReason: item[27],
				orderTag: JSON.stringify(item[62]).replace(/[[\]]/g, ''),
			};
		});

		arrOfObjects.map(
			async ({
				idSystemGc,
				idAzatGc,
				idUserGc,
				userName,
				userEmail,
				userPhone,
				createdAt,
				payedAt,
				orderName,
				dealStatus,
				price,
				payedPrice,
				payFee,
				income,
				taxes,
				profit,
				otherFee,
				netProfit,
				managerName,
				city,
				payedBy,
				promocodeUsed,
				promoCompany,
				utmSource,
				utmMedium,
				utmCampaign,
				utmContent,
				utmTerm,
				utmGroup,
				workWithOrder,
				orderComments,
				rejectReason,
				orderTag,
			}) => {
				const newOrder = new Order(
					idSystemGc,
					idAzatGc,
					idUserGc,
					userName,
					userEmail,
					userPhone,
					createdAt,
					payedAt,
					orderName,
					dealStatus,
					price,
					payedPrice,
					payFee,
					income,
					taxes,
					profit,
					otherFee,
					netProfit,
					managerName,
					city,
					payedBy,
					promocodeUsed,
					promoCompany,
					utmSource,
					utmMedium,
					utmCampaign,
					utmContent,
					utmTerm,
					utmGroup,
					workWithOrder,
					orderComments,
					rejectReason,
					orderTag,
				);
				if (newOrder.price === 0) {
					const existedOrder = await this.ordersRepository.findNullOrderDb(newOrder.idSystemGc);
					if (existedOrder) {
						this.loggerService.log('Такой 0 заказ существует, обновляем данные');
						this.ordersRepository.updateNullOrderDb(existedOrder.id, newOrder);
					} else {
						this.loggerService.log('Такого 0 заказа нет, создаем новый');
						this.ordersRepository.createNullOrderDb(newOrder);
					}
				} else {
					const existedOrder = await this.ordersRepository.findOrderDb(newOrder.idSystemGc);
					if (existedOrder) {
						this.loggerService.log('Такой заказ существует, обновляем данные');
						this.ordersRepository.updateOrderDb(existedOrder.id, newOrder);
					} else {
						this.loggerService.log('Такого заказа нет, создаем новый');
						this.ordersRepository.createOrderDb(newOrder);
					}
				}
			},
		);
		return null;
		// данные распарсиваем
		// если цена продукта больше 0 ---> вызов репозитория OrderCreate
		// если цена продукта равна 0 ---> вызов репозитория NullOrderCreate
	}
}
