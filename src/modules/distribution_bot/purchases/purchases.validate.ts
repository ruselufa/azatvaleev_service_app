import { IMiddleware } from '../../../common/middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { ClassConstructor, plainToClass, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserCreateDto } from './dto/user-create.dto';

export class ValidateUserMiddleware implements IMiddleware {
	constructor(private classToValidate: ClassConstructor<object>) {}

	execute({ query }: Request, res: Response, next: NextFunction): void {
		const transferObject: UserCreateDto = {
			gcUserId: Number(query.gcUserId),
			email: String(query.email),
			firstName: String(query.firstName),
			lastName: String(query.lastName),
			gcOrderId: Number(query.gcOrderId),
			positionsInOrder: String(query.positionsInOrder),
			createdAtOrder: String(query.createdAtOrder),
			statusOrder: String(query.statusOrder),
		};
		const instance = plainToInstance(this.classToValidate, transferObject);
		validate(instance).then((errors) => {
			if (errors.length > 0) {
				res.status(422).send(errors);
			} else {
				next();
			}
		});
	}
}
