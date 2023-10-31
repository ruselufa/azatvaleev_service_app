import { IMiddleware } from '../../../common/middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { ClassConstructor, plainToClass, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PurchaseCreateDto } from './dto/purchase-create.dto';

export class ValidatePurchaseMiddleware implements IMiddleware {
	constructor(private classToValidate: ClassConstructor<object>) {}

	execute({ query }: Request, res: Response, next: NextFunction): void {
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
