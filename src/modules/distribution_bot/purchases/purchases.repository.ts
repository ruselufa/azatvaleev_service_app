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

	async find(gcPurchaseId: number): Promise<PurchaseModel | null> {
		return this.prismaService.client.purchaseModel.findFirst({
			where: {
				gcPurchaseId,
			},
		});
	}
	async updateFinishAt(id: number, finishAt: string, purchase_ink: string): Promise<PurchaseModel> {
		return this.prismaService.client.purchaseModel.update({
			where: {
				id,
			},
			data: {
				finishAt,
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

	async findAlina2Cake(gcPurchaseId: number): Promise<PurchaseModelAlina2Cake | null> {
		return this.prismaService.client.purchaseModelAlina2Cake.findFirst({
			where: {
				gcPurchaseId,
			},
		});
	}

	async updateFinishAtAlina2Cake(
		id: number,
		finishAt: string,
		purchase_ink: string,
	): Promise<PurchaseModelAlina2Cake> {
		return this.prismaService.client.purchaseModelAlina2Cake.update({
			where: {
				id,
			},
			data: {
				finishAt,
				purchase_ink,
			},
		});
	}
}
