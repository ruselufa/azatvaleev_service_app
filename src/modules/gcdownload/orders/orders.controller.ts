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
	async startCronJob(): Promise<void> {
		const exportId = 31107796;
		if (exportId !== null) {
			const exportData = await this.ordersService.makeExport(exportId);
			await this.ordersService.writeExportData(exportData);
			// console.log(exportData.data.info.fields);
			// const dataItems: string[] = exportData.data.info.items;
			// console.log(dataItems.length);
			// const filteredArray = exportData.data.info.items[0].filter(
			// 	(el: any, index: number) => index <= 24,
			// );
			// console.log(filteredArray);
		}
		// this.cronJob = new CronJob(
		// 	'*/30 * * * * *',
		// 	async () => {
		// 		try {
		// 			const exportId = await this.ordersService.createExportId(3, 600000);
		// 			// const exportId = 31107796;
		// 			if (exportId !== null) {
		// 				const exportData = await this.ordersService.makeExport(exportId);
		// 				await this.ordersService.writeExportData(exportData);
		// 			}
		// 		} catch (error) {
		// 			console.error(error);
		// 		}
		// 	},
		// 	null,
		// 	true,
		// );
	}
}

// https://azatvaleev.getcourse.ru/pl/api/account/deals/?key=lMPb6M7lh3nNp94uf9KAREkeBybTHVE1ZP9Fcj0I81C6EMr79TuVYHCI3lnpwnn6Su7uUh5baosjO2SHZvpfeLQRfqjTCAp8lk8IPRVatDYoYdCkbCfKJD1H8JKxonFn&created_at[from]=2023-08-25&created_at[to]=2023-11-25

// https://azatvaleev.getcourse.ru/pl/api/account/exports/30804057?key=lMPb6M7lh3nNp94uf9KAREkeBybTHVE1ZP9Fcj0I81C6EMr79TuVYHCI3lnpwnn6Su7uUh5baosjO2SHZvpfeLQRfqjTCAp8lk8IPRVatDYoYdCkbCfKJD1H8JKxonFn
