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
		const existedPurchase = await this.purchaseRepository.find(email);
		if (existedPurchase !== null) {
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
			const newPurchaseStartDateArr = newUser.startAt.split(' ');
			const newPurchaseFinishDateArr = newUser.finishAt.split(' ');
			const existedPurchaseStartDateArr = existedPurchase.startAt.split(' ');
			const existedPurchaseFinishDateArr = existedPurchase.finishAt.split(' ');
			let newPurchaseFinishDate,
				newPurchaseStartDate,
				existedPurchaseFinishDate,
				existedPurchaseStartDate;
			month.map((m, i) => {
				if (m === newPurchaseStartDateArr[1]) {
					newPurchaseStartDate = Date.parse(
						`${newPurchaseStartDateArr[2]}-${String(i + 1)}-${newPurchaseStartDateArr[0]}`,
					);
				}
				if (m === newPurchaseFinishDateArr[1]) {
					newPurchaseFinishDate = Date.parse(
						`${newPurchaseFinishDateArr[2]}-${String(i + 1)}-${newPurchaseFinishDateArr[0]}`,
					);
				}
				if (m === existedPurchaseFinishDateArr[1]) {
					existedPurchaseFinishDate = Date.parse(
						`${existedPurchaseFinishDateArr[2]}-${String(i + 1)}-${
							existedPurchaseFinishDateArr[0]
						}`,
					);
				}
				if (m === existedPurchaseStartDateArr[1]) {
					existedPurchaseStartDate = Date.parse(
						`${existedPurchaseStartDateArr[2]}-${String(i + 1)}-${existedPurchaseStartDateArr[0]}`,
					);
				}
			});
			if (existedPurchase.state !== newUser.state) {
				console.log('Статус старой покупки', existedPurchase.state);
				console.log('Статус новой покупки', newUser.state);
				console.log('В старой покупке статус Не началась, а в новой - Активен');
				return this.purchaseRepository.updateFinishAt(
					existedPurchase.id,
					newUser.startAt,
					newUser.finishAt,
					newUser.purchase_ink,
					newUser.state,
				);
			}
			if (newPurchaseFinishDate === undefined || newPurchaseStartDate === undefined) {
				console.log('В новой покупке нет даты окончания курса, не трогаем');
				return null;
			}
			if (existedPurchaseFinishDate === undefined && existedPurchaseStartDate === undefined) {
				console.log('В старой покупке нет даты ок курса и нач курса, обновляем все');
				return this.purchaseRepository.updateFinishAt(
					existedPurchase.id,
					newUser.startAt,
					newUser.finishAt,
					newUser.purchase_ink,
					newUser.state,
				);
			}
			if (
				existedPurchaseStartDate !== undefined &&
				existedPurchaseFinishDate !== undefined &&
				existedPurchaseFinishDate < newPurchaseFinishDate
			) {
				console.log(
					'В старой покупке дата ок курса раньше новой покупки, обновляем дату окончания',
				);
				return this.purchaseRepository.updateFinishAt(
					existedPurchase.id,
					existedPurchase.startAt,
					newUser.finishAt,
					newUser.purchase_ink,
					newUser.state,
				);
			}
			if (
				existedPurchaseFinishDate !== undefined &&
				existedPurchaseFinishDate >= newPurchaseFinishDate
			) {
				console.log('В новой покупке дата окончания курса раньше старой покупки, не трогаем');
				return null;
			}
		}
		console.log('Такой покупки нет, создаем новую');
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
		const existedPurchase = await this.purchaseRepository.findAlina2Cake(email);
		if (existedPurchase !== null) {
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
			const newPurchaseStartDateArr = newUser.startAt.split(' ');
			const newPurchaseFinishDateArr = newUser.finishAt.split(' ');
			const existedPurchaseStartDateArr = existedPurchase.startAt.split(' ');
			const existedPurchaseFinishDateArr = existedPurchase.finishAt.split(' ');
			let newPurchaseStartDate,
				newPurchaseFinishDate,
				existedPurchaseFinishDate,
				existedPurchaseStartDate;
			month.map((m, i) => {
				if (m === newPurchaseStartDateArr[1]) {
					newPurchaseStartDate = Date.parse(
						`${newPurchaseStartDateArr[2]}-${String(i + 1)}-${newPurchaseStartDateArr[0]}`,
					);
				}
				if (m === newPurchaseFinishDateArr[1]) {
					newPurchaseFinishDate = Date.parse(
						`${newPurchaseFinishDateArr[2]}-${String(i + 1)}-${newPurchaseFinishDateArr[0]}`,
					);
				}
				if (m === existedPurchaseFinishDateArr[1]) {
					existedPurchaseFinishDate = Date.parse(
						`${existedPurchaseFinishDateArr[2]}-${String(i + 1)}-${
							existedPurchaseFinishDateArr[0]
						}`,
					);
				}
				if (m === existedPurchaseStartDateArr[1]) {
					existedPurchaseStartDate = Date.parse(
						`${existedPurchaseStartDateArr[2]}-${String(i + 1)}-${existedPurchaseStartDateArr[0]}`,
					);
				}
			});
			if (newPurchaseFinishDate === undefined || newPurchaseStartDate === undefined) {
				console.log('В новой покупке нет даты окончания курса, не трогаем');
				return null;
			}
			if (existedPurchaseFinishDate === undefined && existedPurchaseStartDate === undefined) {
				console.log('В старой покупке нет даты ок курса и нач курса, обновляем все');
				return this.purchaseRepository.updateFinishAtAlina2Cake(
					existedPurchase.id,
					newUser.startAt,
					newUser.finishAt,
					newUser.purchase_ink,
					newUser.state,
				);
			}
			if (
				existedPurchaseStartDate !== undefined &&
				existedPurchaseFinishDate !== undefined &&
				existedPurchaseFinishDate < newPurchaseFinishDate
			) {
				console.log(
					'В старой покупке дата ок курса раньше новой покупки, обновляем дату окончания',
				);
				return this.purchaseRepository.updateFinishAtAlina2Cake(
					existedPurchase.id,
					existedPurchase.startAt,
					newUser.finishAt,
					newUser.purchase_ink,
					newUser.state,
				);
			}
			if (
				existedPurchaseFinishDate !== undefined &&
				existedPurchaseFinishDate >= newPurchaseFinishDate
			) {
				console.log('В новой покупке дата окончания курса раньше старой покупки, не трогаем');
				return null;
			}
		}
		console.log('Такой покупки нет, создаем новую');
		return this.purchaseRepository.createAlina2Cake(newUser);
	}
}
