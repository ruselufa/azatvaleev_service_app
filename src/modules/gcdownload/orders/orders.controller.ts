import { inject } from 'inversify';
import { BaseController } from '../../../common/base.controller';
import { IOrdersControllerInterface } from './orders.controller.interface';
import { TYPES } from '../../../types';
import { ILogger } from '../../../logger/logger.interface';
import { IConfigService } from '../../../config/config.service.interface';
import { Request, Response, NextFunction } from 'express';
import { OrderCreateDto } from './dto/order-create.dto';
import { IOrdersService } from './orders.service.interface';
import { PREFIX } from '../../../helpers/api';
import { CronJob } from 'cron';

export class OrdersController extends BaseController implements IOrdersControllerInterface {
	cronJob: CronJob;
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.OrdersService) private ordersService: IOrdersService,
	) {
		super(loggerService);
	}
	async requireExportId(): Promise<void> {
		// const exportId = 31107796;
		// if (exportId !== null) {
		// 	const exportData = await this.ordersService.makeExport(exportId);
		// 	await this.ordersService.writeExportData(exportData);
		// }
		this.cronJob = new CronJob(
			'15 0 1,13 * * *',
			async () => {
				try {
					this.loggerService.log(
						'Создаем ID экспорта запросов в геткурс и записываем в БД экспортов',
					);
					// Создаем ID экспорта запросов в геткурс и записываем в БД экспортов
					await this.ordersService.createExportId(3, 600000);
					// const exportId = 31107796;
					// Получаем этот Export ID и передаем его дальше
					this.loggerService.log('Записали экспорты в БД');
				} catch (error) {
					console.error(error);
				}
			},
			null,
			true,
			'Asia/Yekaterinburg',
		);
	}
	async exportOrders(): Promise<void> {
		// Запускаем задачу по загрузке всех готовых экспортов в таблицу
		this.cronJob = new CronJob(
			'15 0 7,19 * * *',
			async () => {
				try {
					this.loggerService.log('Начинаю поиск готовых экспортов');
					// Читаем из БД первый экспорт со статусом creating
					const findedExports = await this.ordersService.findStatusExportTask('creating');
					this.loggerService.log(typeof findedExports);
					// Экспортируем данные из этого экспорта
					if (findedExports.length === 0) {
						throw new Error('Не найден экспорт со статусом [creating]');
						// Если Export ID существует, то запрашиваем данные и экспортруем файл
						// После экспорта обновляем в таблице что этот ExportID экспортирован и записан в таблицу
					}
					findedExports.forEach(async (findedExportItem) => {
						this.loggerService.log('Пробегаемся по готовым экспортам');
						try {
							const exportData = await this.ordersService.makeExport(findedExportItem.gcId);
							if (!exportData) {
								throw new Error('Не получены данные экспорта из Getcourse');
							}
							this.loggerService.log('Записываем заказы в БД');
							await this.ordersService.writeExportData(exportData);
							this.loggerService.log('Изменяем статус экспорта в [exported]');
							await this.ordersService.updateExportId(findedExportItem.id, 'exported');
						} catch (error) {
							this.loggerService.error(error);
							return;
						}
					});
				} catch (error) {
					this.loggerService.log(error);
					return;
				}
			},
			null,
			true,
			'Asia/Yekaterinburg',
		);
	}
}

// https://azatvaleev.getcourse.ru/pl/api/account/deals/?key=lMPb6M7lh3nNp94uf9KAREkeBybTHVE1ZP9Fcj0I81C6EMr79TuVYHCI3lnpwnn6Su7uUh5baosjO2SHZvpfeLQRfqjTCAp8lk8IPRVatDYoYdCkbCfKJD1H8JKxonFn&created_at[from]=2023-08-25&created_at[to]=2023-11-25

// https://azatvaleev.getcourse.ru/pl/api/account/exports/30804057?key=lMPb6M7lh3nNp94uf9KAREkeBybTHVE1ZP9Fcj0I81C6EMr79TuVYHCI3lnpwnn6Su7uUh5baosjO2SHZvpfeLQRfqjTCAp8lk8IPRVatDYoYdCkbCfKJD1H8JKxonFn
