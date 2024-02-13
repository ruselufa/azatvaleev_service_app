import { Response, Request, NextFunction } from 'express';
import { BaseController } from '../../../../../getcourse-sales-id/src/common/base.controller';
import { LoggerService } from '../../../../../getcourse-sales-id/src/logger/logger.service';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { SaleCreateDto } from './dto/sales-create.dto';
import { SalesControllerService } from './sales.controller.service';

export class SalesController extends BaseController {
	salesControllerService: SalesControllerService;

	path: string;
	func: (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction,
	) => void;
	method: 'get' | 'post' | 'delete' | 'patch' | 'put';

	constructor(logger: LoggerService) {
		super(logger);
		this.salesControllerService = new SalesControllerService();
		this.bindRoutes([{ path: '/get', method: 'get', func: this.apiRecieve }]);
	}

	async apiRecieve(req: Request<{}, {}, SaleCreateDto>, res: Response) {
		const transferObject: SaleCreateDto = {
			id: String(req.query.id),
			firstname: String(req.query.firstName),
			lastname: String(req.query.lastName),
			phone: String(req.query.phone),
		};
		//вызываем метод из сервиса для формирования данных и отправления в таблицу
		this.salesControllerService.googleSheetsGetSalesData(transferObject);
		return this.ok(res, `Your Data Accept: ${transferObject.id}`);
	}
}
