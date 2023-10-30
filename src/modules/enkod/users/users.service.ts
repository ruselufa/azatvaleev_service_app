import { inject, injectable } from 'inversify';
import { IPurchasesService } from './purchases.service.interface';
import { TYPES } from '../../../types';
import { IConfigService } from '../../../config/config.service.interface';
import { IPurchaseRepository } from './purchases.repository.interface';
import { Purchase } from './purchases.entity';
import { PurchaseModel } from '@prisma/client';
import { PurchaseCreateDto } from './dto/purchase-create.dto';

@injectable()
export class PurchaseService implements IPurchasesService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PurchasesRepository) private purchaseRepository: IPurchaseRepository,
	) {}
	async createUser({
		                 gcPurchaseId,
		                 email,
		                 name,
		                 gcUserId,
		                 productTitle,
		                 startAt,
		                 finishAt,
		                 period,
		                 state,
		                 purchase_ink,
	                 }: PurchaseCreateDto): Promise<PurchaseModel | null> {
		const newUser = new Purchase(
			gcPurchaseId,
			email,
			name,
			gcUserId,
			productTitle,
			startAt,
			finishAt,
			period,
			state,
			purchase_ink,
		);
		return this.purchaseRepository.create(newUser);
	}
}
