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
import { ValidateUserMiddleware } from './users.validate';
import axios from 'axios';

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
				middlewares: [new ValidateUserMiddleware(UserCreateDto)],
			},
		]);
	}

	async apiReceive(
		req: Request<{}, {}, UserCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const transferObject: UserCreateDto = {
			gcUserId: Number(req.query.gcUserId),
			email: String(req.query.email),
			firstName: String(req.query.firstName),
			lastName: String(req.query.lastName),
			gcOrderId: Number(req.query.gcOrderId),
			positionsInOrder: String(req.query.positionsInOrder),
			createdAtOrder: String(req.query.createdAtOrder),
			statusOrder: String(req.query.statusOrder),
		};
		const result = await this.usersEnkodService.createUser(transferObject);
		await this.apiSend(transferObject);
		if (!result) {
			return next(new HTTPError(422, 'Ошибка записи пользователя'));
		}
		this.ok(res, `Сообщение получено`);
	}

	async apiSend(transferObject: UserCreateDto): Promise<void> {
		const logger = this.loggerService.log.bind(this.loggerService);
		await axios
			.post(
				'https://api.enkod.ru/v1/person/',
				{
					firstName: transferObject.firstName,
					lastName: transferObject.lastName,
					email: transferObject.email,
					mainChannel: 'email',
					method: 'addAndUpdate',
					tags: ['fromGC'],
					groups: ['exceptions_1'],
					subscriptionMethod: 'subscribeAll',
				},
				{
					headers: {
						'Content-Type': 'application/json',
						apiKey: 'QaboEndsCjuVF81oAbGfPvs500Vaw5Rta7xhQVn05WMu',
					},
				},
			)
			.then(function (response) {
				logger(response.status, response.statusText);
			})
			.catch(function (error) {
				console.log(error);
			});
	}
}
