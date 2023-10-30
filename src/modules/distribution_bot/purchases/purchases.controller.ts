import { BaseController } from '../../../common/base.controller';
import { IPurchasesControllerInterface } from './purchases.controller.interface';
import { NextFunction, Request, Response } from 'express';
import { inject } from 'inversify';
import { TYPES } from '../../../types';
import { ILogger } from '../../../logger/logger.interface';
import { IConfigService } from '../../../config/config.service.interface';
import { IPurchasesService } from './purchases.service.interface';
import { HTTPError } from '../../../error/http-error.class';
import { PurchaseCreateDto } from './dto/purchase-create.dto';

export class PurchasesController extends BaseController implements IPurchasesControllerInterface {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PurchasesService) private purchasesService: IPurchasesService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/add',
				method: 'get',
				func: this.apiReceive,
				middlewares: [],
			},
		]);
	}

	async apiReceive({ query }: Request, res: Response, next: NextFunction): Promise<void> {
		const transferObj = JSON.stringify(query);
		console.log(transferObj);
		const transferObject: PurchaseCreateDto = {
			gcPurchaseId: Number(query.gcPurchaseId),
			email: String(query.email),
			name: String(query.name),
			gcUserId: Number(query.gcUserId),
			productTitle: String(query.productTitle),
			startAt: String(query.startAt),
			finishAt: String(query.finishAt),
			period: String(query.period),
			state: String(query.state),
			purchase_ink: String(query.purchase_ink),
		};
		const result = await this.purchasesService.createUser(transferObject);
		if (!result) {
			return next(new HTTPError(422, 'Ошибка записи пользователя'));
		}
		// console.log(req.query);
		this.ok(res, `Сообщение получено: ${query}`);
	}
}
