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
			const response = await this.requestExportId();
			if (!response) {
				throw new Error('Не выгружен файл экспорта');
			}
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
			console.log(response.data);
			const data = response.data;
			const newExport = new ExportId(
				'Экспорт заказов Азат',
				data.info.export_id,
				'creating',
				new Date(),
				new Date(),
			);
			await this.ordersRepository.createExportIdDb(newExport);
			return data.info.export_id;
		} catch (error) {
			this.loggerService.error('Ошибка обработки: ', error);
		}
		return null;
	}
	async createOrder(order: OrderCreateDto): Promise<OrderModel | null> {
		return null;
	}

	async updateOrder(order: OrderCreateDto): Promise<OrderModel | null> {
		return null;
	}

	async requestExportId(): Promise<AxiosResponse | undefined> {
		try {
			const apiKey = this.configService.get('GC_API_KEY');
			const PREFIX = this.configService.get('GC_PREFIX');
			const now = new Date();
			const quarterAgo = new Date(now);
			quarterAgo.setMonth(quarterAgo.getMonth() - 3);
			const agoDateGc = quarterAgo.toISOString().split('T')[0];
			const nowDateGc = now.toISOString().split('T')[0];
			const result = await axios.get(
				`${PREFIX}/deals?key=${apiKey}&created_at[from]=${agoDateGc}&created_at[to]=${nowDateGc}`,
			);
			console.log(
				`${PREFIX}/deals?key=${apiKey}&created_at[from]=${agoDateGc}&created_at[to]=${nowDateGc}`,
			);
			return result;
		} catch (error) {
			this.loggerService.error('An error occurred in requestExportId:', error);
			return;
		}
	}

	async makeExport(exportId: number): Promise<AxiosResponse | undefined> {
		try {
			const apiKey = this.configService.get('GC_API_KEY');
			const PREFIX = this.configService.get('GC_PREFIX');
			const startExport = await this.ordersRepository.findExportIdDb(exportId);
			if (startExport === null) {
				throw new Error('Не найден ID экспорта в репозитории');
			}
			const result = await axios.get(`${PREFIX}/exports/${exportId}?key=${apiKey}`);
			if (result.data.error && result.data.error_code === 910) {
				await this.updateExportId(startExport.id, 'bad_export_id');
				throw new Error('Файл не создан, попробуйте другой фильтр');
			}
			return result;
		} catch (error) {
			this.loggerService.error(error);
			return undefined;
		}
	}

	async findStatusExportTask(status: string): Promise<ExportModel[] | []> {
		try {
			const findedExport = await this.ordersRepository.findStatusExportId(status);
			if (findedExport.length === 0) {
				return [];
			}
			return findedExport;
		} catch (error) {
			this.loggerService.error('Error in updateExportId: ', error);
			return [];
		}
	}

	async updateExportId(id: number, status: string): Promise<ExportModel | null> {
		try {
			const result = await this.ordersRepository.updateStatusExportId(id, status);
			return result;
		} catch (error) {
			this.loggerService.error('Error in updateExportId: ', error);
			return null;
		}
	}
	async writeExportData(data: AxiosResponse): Promise<OrderModel | null> {
		try {
			// получаем данные из makeExport
			const newData: string[][] = data.data.info.items;
			const nullArrOfObjects: any[] = [];
			const realArrOfObjects: any[] = [];
			newData.forEach((item) => {
				if (Number(item[10]) === 0) {
					const tagItemIndex = item.length - 2;
					nullArrOfObjects.push({
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
						orderTag: JSON.stringify(item[tagItemIndex]).replace(/[[\]]/g, ''),
					});
				} else {
					const tagItemIndex = item.length - 2;
					realArrOfObjects.push({
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
						orderTag: JSON.stringify(item[tagItemIndex]).replace(/[[\]]/g, ''),
					});
				}
			});
			this.loggerService.log('Количество обычных заказов: ', realArrOfObjects.length);
			this.loggerService.log('Количество нулевых заказов: ', nullArrOfObjects.length);
			const batchSize = 100;

			for (let i = 0; i < nullArrOfObjects.length; i += batchSize) {
				const batch = nullArrOfObjects.slice(i, i + batchSize);
				const promises = batch.map(async (item: Order) => {
					const existingItem = await this.ordersRepository.findNullOrderDb(item.idSystemGc);
					if (existingItem) {
						await this.ordersRepository.updateNullOrderDb(existingItem.id, item);
					} else {
						await this.ordersRepository.createNullOrderDb(item);
					}
				});
				await Promise.all(promises);
				this.loggerService.log('Processed batch of null orders: ', i);
			}

			for (let i = 0; i < realArrOfObjects.length; i += batchSize) {
				const batch = realArrOfObjects.slice(i, i + batchSize);
				const promises = batch.map(async (item: Order) => {
					const existingItem = await this.ordersRepository.findOrderDb(item.idSystemGc);
					if (existingItem) {
						await this.ordersRepository.updateOrderDb(existingItem.id, item);
					} else {
						await this.ordersRepository.createOrderDb(item);
					}
				});
				await Promise.all(promises);
				this.loggerService.log('Processed batch of ordinary orders: ', i);
			}
			return null;
		} catch (error) {
			this.loggerService.error('Error in writeExportData: ', error);
			return null;
		}
	}
	// async writeExportData(data: AxiosResponse): Promise<OrderModel | null> {
	// 	// получаем данные из makeExport
	// 	const newData: string[][] = data.data.info.items;
	// 	const arrOfObjects = newData.map((item) => {
	// 		return {
	// 			idSystemGc: Number(item[0]),
	// 			idAzatGc: Number(item[1]),
	// 			idUserGc: Number(item[2]),
	// 			userName: item[3],
	// 			userEmail: item[4],
	// 			userPhone: item[5],
	// 			createdAt: item[6],
	// 			payedAt: item[7],
	// 			orderName: item[8],
	// 			dealStatus: item[9],
	// 			price: Number(item[10]),
	// 			payedPrice: Number(item[11]),
	// 			payFee: Number(item[12]),
	// 			income: Number(item[13]),
	// 			taxes: Number(item[14]),
	// 			profit: Number(item[15]),
	// 			otherFee: Number(item[16]),
	// 			netProfit: Number(item[17]),
	// 			managerName: item[19],
	// 			city: item[20],
	// 			payedBy: item[21],
	// 			promocodeUsed: item[23],
	// 			promoCompany: item[24],
	// 			utmSource: item[46],
	// 			utmMedium: item[47],
	// 			utmCampaign: item[48],
	// 			utmContent: item[49],
	// 			utmTerm: item[50],
	// 			utmGroup: item[51],
	// 			workWithOrder: item[25],
	// 			orderComments: item[26],
	// 			rejectReason: item[27],
	// 			orderTag: JSON.stringify(item[62]).replace(/[[\]]/g, ''),
	// 		};
	// 	});

	// 	arrOfObjects.map(
	// 		async ({
	// 			idSystemGc,
	// 			idAzatGc,
	// 			idUserGc,
	// 			userName,
	// 			userEmail,
	// 			userPhone,
	// 			createdAt,
	// 			payedAt,
	// 			orderName,
	// 			dealStatus,
	// 			price,
	// 			payedPrice,
	// 			payFee,
	// 			income,
	// 			taxes,
	// 			profit,
	// 			otherFee,
	// 			netProfit,
	// 			managerName,
	// 			city,
	// 			payedBy,
	// 			promocodeUsed,
	// 			promoCompany,
	// 			utmSource,
	// 			utmMedium,
	// 			utmCampaign,
	// 			utmContent,
	// 			utmTerm,
	// 			utmGroup,
	// 			workWithOrder,
	// 			orderComments,
	// 			rejectReason,
	// 			orderTag,
	// 		}) => {
	// 			const newOrder = new Order(
	// 				idSystemGc,
	// 				idAzatGc,
	// 				idUserGc,
	// 				userName,
	// 				userEmail,
	// 				userPhone,
	// 				createdAt,
	// 				payedAt,
	// 				orderName,
	// 				dealStatus,
	// 				price,
	// 				payedPrice,
	// 				payFee,
	// 				income,
	// 				taxes,
	// 				profit,
	// 				otherFee,
	// 				netProfit,
	// 				managerName,
	// 				city,
	// 				payedBy,
	// 				promocodeUsed,
	// 				promoCompany,
	// 				utmSource,
	// 				utmMedium,
	// 				utmCampaign,
	// 				utmContent,
	// 				utmTerm,
	// 				utmGroup,
	// 				workWithOrder,
	// 				orderComments,
	// 				rejectReason,
	// 				orderTag,
	// 			);
	// 			if (newOrder.price === 0) {
	// 				const existedOrder = await this.ordersRepository.findNullOrderDb(newOrder.idSystemGc);
	// 				if (existedOrder) {
	// 					this.loggerService.log('Такой 0 заказ существует, обновляем данные');
	// 					this.ordersRepository.updateNullOrderDb(existedOrder.id, newOrder);
	// 				} else {
	// 					this.loggerService.log('Такого 0 заказа нет, создаем новый');
	// 					this.ordersRepository.createNullOrderDb(newOrder);
	// 				}
	// 			} else {
	// 				const existedOrder = await this.ordersRepository.findOrderDb(newOrder.idSystemGc);
	// 				if (existedOrder) {
	// 					this.loggerService.log('Такой заказ существует, обновляем данные');
	// 					this.ordersRepository.updateOrderDb(existedOrder.id, newOrder);
	// 				} else {
	// 					this.loggerService.log('Такого заказа нет, создаем новый');
	// 					this.ordersRepository.createOrderDb(newOrder);
	// 				}
	// 			}
	// 		},
	// 	);
	// 	return null;
	// 	// данные распарсиваем
	// 	// если цена продукта больше 0 ---> вызов репозитория OrderCreate
	// 	// если цена продукта равна 0 ---> вызов репозитория NullOrderCreate
	// }
}
