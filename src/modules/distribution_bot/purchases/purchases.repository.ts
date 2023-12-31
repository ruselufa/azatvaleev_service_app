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

	async find(email: string): Promise<PurchaseModel | null> {
		return this.prismaService.client.purchaseModel.findFirst({
			where: {
				email,
			},
		});
	}
	async updateFinishAt(
		id: number,
		startAt: string,
		finishAt: string,
		purchase_ink: string,
		state: string,
	): Promise<PurchaseModel> {
		return this.prismaService.client.purchaseModel.update({
			where: {
				id,
			},
			data: {
				startAt,
				finishAt,
				purchase_ink,
				state,
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

	async findAlina2Cake(email: string): Promise<PurchaseModelAlina2Cake | null> {
		return this.prismaService.client.purchaseModelAlina2Cake.findFirst({
			where: {
				email,
			},
		});
	}

	async updateFinishAtAlina2Cake(
		id: number,
		startAt: string,
		finishAt: string,
		purchase_ink: string,
		state: string,
	): Promise<PurchaseModelAlina2Cake> {
		return this.prismaService.client.purchaseModelAlina2Cake.update({
			where: {
				id,
			},
			data: {
				startAt,
				finishAt,
				purchase_ink,
				state,
			},
		});
	}
}
