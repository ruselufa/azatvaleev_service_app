import { IPurchaseRepository } from './purchases.repository.interface';
import { inject, injectable } from 'inversify';
import { PurchaseModel, PurchaseModelAlina2Cake } from '@prisma/client';
import { TYPES } from '../../../types';
import { PrismaService } from '../../../database/prisma.service';
import { Purchase } from './purchases.entity';

@injectable()
export class PurchasesRepository implements IPurchaseRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}
	async create({
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
	}: Purchase): Promise<PurchaseModel> {
		return this.prismaService.client.purchaseModel.create({
			data: {
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
			},
		});
	}
	async createAlina2Cake({
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
	}: Purchase): Promise<PurchaseModelAlina2Cake> {
		return this.prismaService.client.purchaseModelAlina2Cake.create({
			data: {
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
			},
		});
	}

	async find(email: string): Promise<PurchaseModel | null> {
		return this.prismaService.client.purchaseModel.findFirst({
			where: {
				email,
			},
		});
	}
}
