import { BaseController } from '../../../common/base.controller';
import { NextFunction, Request, Response } from 'express';
import { inject } from 'inversify';
import { TYPES } from '../../../types';
import { ILogger } from '../../../logger/logger.interface';
import { IConfigService } from '../../../config/config.service.interface';
import { HTTPError } from '../../../error/http-error.class';
import { UserCreateDto } from './dto/user-create.dto';
import { IUsersEnkodControllerInterface } from './users.controller.interface';
import { IUsersEnkodService } from './users.service.interface';

export class UsersEnkodController extends BaseController implements IUsersEnkodControllerInterface {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersEnkodService) private usersEnkodService: IUsersEnkodService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/send',
				method: 'get',
				func: this.apiReceive,
				middlewares: [],
			},
		]);
	}

	async apiReceive({ query }: Request, res: Response, next: NextFunction): Promise<void> {
		const transferObj = JSON.stringify(query);
		console.log(transferObj);
		const transferObject: UserCreateDto = {
			gcUserId: Number(query.gcPurchaseId),
			email: String(query.email),
			firstName: String(query.name),
			lastName: String(query.productTitle),
			gcOrderId: Number(query.gcUserId),
			positionsInOrder: String(query.startAt),
			createdAtOrder: String(query.finishAt),
			statusOrder: String(query.period),
		};
		const result = await this.usersEnkodService.createUser(transferObject);
		if (!result) {
			return next(new HTTPError(422, 'Ошибка записи пользователя'));
		}
		// console.log(req.query);
		this.ok(res, `Сообщение получено: ${query}`);
	}
}
