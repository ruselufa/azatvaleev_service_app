import { Response, Request, NextFunction } from 'express';
import { BaseController } from '../../../common/base.controller';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { SaleCreateDto } from './dto/sales-create.dto';
import { HTTPError } from '../../../error/http-error.class';
import { inject, injectable } from 'inversify';
import { ILogger } from '../../../logger/logger.interface';
import { TYPES } from '../../../types';
import 'reflect-metadata';
import { SalesControllerService } from './sales.controller.service';

@injectable()
export class SalesController extends BaseController {
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
		@inject(TYPES.SalesControllerService) private salesControllerService: SalesControllerService, // @inject(TYPES.GoogleSheetService) private googleSheetService: GoogleSheetService
	) {
		super(loggerService);
		this.bindRoutes([
			{ path: '/getGoogleSheet', method: 'get', func: this.apiRecieveGoogleSheet },

			{ path: '/getCsvData', method: 'get', func: this.apiRecieveCsvData },

			{ path: '/error', method: 'get', func: this.getError },
		]);
	}

	async apiRecieveGoogleSheet(
		req: Request<{}, {}, SaleCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const transferObject: SaleCreateDto = {
			id: String(req.query.id),
			fullname: String(req.query.firstName) + ' ' + String(req.query.lastName),
			phone: String(req.query.phone),
		};
		//вызываем метод из сервиса для формирования данных и отправления в таблицу
		this.salesControllerService.googleSheetsGetSalesData(transferObject);

		this.ok(res, `Your Data Accept into GoogleSheet with ID: ${transferObject.id}`);
	}

	async apiRecieveCsvData(
		req: Request<{}, {}, SaleCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const transferObject: SaleCreateDto = {
			id: String(req.query.id),
			fullname: String(req.query.firstName) + ' ' + String(req.query.lastName),
			phone: String(req.query.phone),
		};
		//вызываем метод из сервиса для формирования данных и отправления в CSV
		this.salesControllerService.writeDataToCsv([transferObject]);

		this.ok(res, `Your Data Accept into CSV with ID: ${transferObject.id}`);
	}

	async getError(req: Request, res: Response, next: NextFunction): Promise<void> {
		next(new HTTPError(401, 'Ошибка авторизации'));
	}
}
