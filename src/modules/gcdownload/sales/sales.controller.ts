import { Response, Request, NextFunction } from 'express';
import { BaseController } from '../../../../../getcourse-sales-id/src/common/base.controller';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { SaleCreateDto } from '../sales/dto/sales-create.dto';
import { inject, injectable } from 'inversify';
import { ILogger } from '../../../../../getcourse-sales-id/src/logger/logger.interface';
import { TYPES } from '../../../../../getcourse-sales-id/src/types';
import { SalesService } from '../sales/sales.service';
import { ValidateMiddleware } from '../../../../../getcourse-sales-id/src/common/validate.middleware';
import { IControllerId } from '../sales/sales.controller.interface';
import 'reflect-metadata';

@injectable()
export class SalesController extends BaseController implements IControllerId {
	path: string;
	func: (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction,
	) => void;
	method: 'get' | 'post' | 'delete' | 'patch' | 'put';

	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		// @inject(TYPES.IControllerId) private salesController: IControllerId,
		@inject(TYPES.SalesService) private salesService: SalesService,
		// @inject(TYPES.GoogleSheetService) private googleSheetService: GoogleSheetService
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/getGoogleSheet',
				method: 'get',
				func: this.apiRecieveGoogleSheet,
				middlewares: [new ValidateMiddleware(SaleCreateDto)],
			},
		]);
	}

	async apiRecieveGoogleSheet(
		req: Request<{}, {}, SaleCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const transferObject: SaleCreateDto = {
			id: String(req.query.id),
			firstName: String(req.query.firstName),
			lastName: String(req.query.lastName),
			phone: String(req.query.phone),
		};
		//вызываем метод из сервиса для формирования данных и отправления в таблицу
		this.salesService.googleSheetsGetSalesData(transferObject);
		this.ok(res, `Your Data Accept into GoogleSheet with ID: ${transferObject.id}`);
	}
}
