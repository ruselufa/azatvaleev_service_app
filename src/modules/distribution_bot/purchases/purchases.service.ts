import { inject, injectable } from 'inversify';
import { IPurchasesService } from './purchases.service.interface';
import { TYPES } from '../../../types';
import { IConfigService } from '../../../config/config.service.interface';
import { IPurchaseRepository } from './purchases.repository.interface';
import { Purchase } from './purchases.entity';
import { PurchaseModel, PurchaseModelAlina2Cake } from '@prisma/client';
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
		const existedPurchase = await this.purchaseRepository.find(gcPurchaseId);
		if (existedPurchase) {
			const month = [
				'Янв',
				'Фев',
				'Мар',
				'Апр',
				'Май',
				'Июн',
				'Июл',
				'Авг',
				'Сен',
				'Окт',
				'Ноя',
				'Дек',
			];
			const newPurchaseDateArr = newUser.finishAt.split(' ');
			const existedPurchaseDateArr = existedPurchase.finishAt.split(' ');
			let newPurchaseDate, existedPurchaseDate;
			month.map((m, i) => {
				if (m === newPurchaseDateArr[1]) {
					newPurchaseDate = Date.parse(
						`${newPurchaseDateArr[2]}-${String(i + 1)}-${newPurchaseDateArr[0]}`,
					);
				}
			});
			month.map((m, i) => {
				if (m === existedPurchaseDateArr[1]) {
					existedPurchaseDate = Date.parse(
						`${existedPurchaseDateArr[2]}-${String(i + 1)}-${existedPurchaseDateArr[0]}`,
					);
				}
			});
			if (newPurchaseDate === undefined) {
				return null;
			}
			if (existedPurchaseDate === undefined) {
				return this.purchaseRepository.updateFinishAt(existedPurchase.id, newUser.finishAt, newUser.purchase_ink);
			}
			if (existedPurchaseDate !== undefined && existedPurchaseDate < newPurchaseDate) {
				return this.purchaseRepository.updateFinishAt(existedPurchase.id, newUser.finishAt, newUser.purchase_ink);
			}
			if (existedPurchaseDate !== undefined && existedPurchaseDate >= newPurchaseDate) {
				return null;
			}
		}
		return this.purchaseRepository.create(newUser);
	}

	async createUserAlina2Cake({
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
	}: PurchaseCreateDto): Promise<PurchaseModelAlina2Cake | null> {
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
		const existedPurchase = await this.purchaseRepository.findAlina2Cake(gcPurchaseId);
		if (existedPurchase) {
			const month = [
				'Янв',
				'Фев',
				'Мар',
				'Апр',
				'Май',
				'Июн',
				'Июл',
				'Авг',
				'Сен',
				'Окт',
				'Ноя',
				'Дек',
			];
			const newPurchaseDateArr = newUser.finishAt.split(' ');
			const existedPurchaseDateArr = existedPurchase.finishAt.split(' ');
			let newPurchaseDate, existedPurchaseDate;
			month.map((m, i) => {
				if (m === newPurchaseDateArr[1]) {
					newPurchaseDate = Date.parse(
						`${newPurchaseDateArr[2]}-${String(i + 1)}-${newPurchaseDateArr[0]}`,
					);
				}
			});
			month.map((m, i) => {
				if (m === existedPurchaseDateArr[1]) {
					existedPurchaseDate = Date.parse(
						`${existedPurchaseDateArr[2]}-${String(i + 1)}-${existedPurchaseDateArr[0]}`,
					);
				}
			});
			if (newPurchaseDate === undefined) {
				return null;
			}
			if (existedPurchaseDate === undefined) {
				return this.purchaseRepository.updateFinishAtAlina2Cake(
					existedPurchase.id,
					newUser.finishAt,
					newUser.purchase_ink,
				);
			}
			if (existedPurchaseDate !== undefined && existedPurchaseDate < newPurchaseDate) {
				return this.purchaseRepository.updateFinishAtAlina2Cake(
					existedPurchase.id,
					newUser.finishAt,
					newUser.purchase_ink,
				);
			}
			if (existedPurchaseDate !== undefined && existedPurchaseDate >= newPurchaseDate) {
				return null;
			}
		}
		return this.purchaseRepository.createAlina2Cake(newUser);
	}
}
