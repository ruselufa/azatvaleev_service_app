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
		this.cronJob = new CronJob('* * * * *', async () => {
			try {
				this.exportIdRequest;
			} catch (error) {
				console.error(error);
			}
		});
	}

	async exportIdRequest(
		{ query }: Request<{}, {}, OrderCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		// const result = await this.ordersService.createExportId();
		console.log('every minute');
		const apiKey = this.configService.get('GC_API_KEY');
	}
}

// https://azatvaleev.getcourse.ru/pl/api/account/deals/?key=lMPb6M7lh3nNp94uf9KAREkeBybTHVE1ZP9Fcj0I81C6EMr79TuVYHCI3lnpwnn6Su7uUh5baosjO2SHZvpfeLQRfqjTCAp8lk8IPRVatDYoYdCkbCfKJD1H8JKxonFn&created_at[from]=2023-08-25&created_at[to]=2023-11-25

// https://azatvaleev.getcourse.ru/pl/api/account/exports/30804057?key=lMPb6M7lh3nNp94uf9KAREkeBybTHVE1ZP9Fcj0I81C6EMr79TuVYHCI3lnpwnn6Su7uUh5baosjO2SHZvpfeLQRfqjTCAp8lk8IPRVatDYoYdCkbCfKJD1H8JKxonFn
