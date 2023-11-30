import { inject, injectable } from 'inversify';
import { IOrdersRepository } from './orders.repository.interface';
import { TYPES } from '../../../types';
import { PrismaService } from '../../../database/prisma.service';
import { ExportId } from './orders.exportid.entity';
import { ExportModel, NullOrderModel, OrderModel } from '@prisma/client';
import { Order } from './orders.entity';

@injectable()
export class OrdersRepository implements IOrdersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}
	async createExportIdDb({
		name,
		gcId,
		status,
		createdDate,
		finishedDate,
	}: ExportId): Promise<ExportModel> {
		return this.prismaService.client.exportModel.create({
			data: {
				name,
				gcId,
				status,
				createdDate,
				finishedDate,
			},
		});
	}
	async findStatusExportId(status: string): Promise<ExportModel[] | []> {
		return this.prismaService.client.exportModel.findMany({
			where: {
				status: `${status}`,
			},
		});
	}
	async updateStatusExportId(id: number, status: string): Promise<ExportModel> {
		return this.prismaService.client.exportModel.update({
			where: {
				id,
			},
			data: {
				status: `${status}`,
				finishedDate: new Date(),
			},
		});
	}
	async findExportIdDb(gcId: number): Promise<ExportModel | null> {
		return this.prismaService.client.exportModel.findFirst({
			where: {
				gcId,
			},
		});
	}
	async createOrderDb({
		idSystemGc,
		idAzatGc,
		idUserGc,
		userName,
		userEmail,
		userPhone,
		createdAt,
		payedAt,
		orderName,
		dealStatus,
		price,
		payedPrice,
		payFee,
		income,
		taxes,
		profit,
		otherFee,
		netProfit,
		managerName,
		city,
		payedBy,
		promocodeUsed,
		promoCompany,
		utmSource,
		utmMedium,
		utmCampaign,
		utmContent,
		utmTerm,
		utmGroup,
		workWithOrder,
		orderComments,
		rejectReason,
		orderTag,
	}: Order): Promise<OrderModel> {
		return this.prismaService.client.orderModel.create({
			data: {
				idSystemGc,
				idAzatGc,
				idUserGc,
				userName,
				userEmail,
				userPhone,
				createdAt,
				payedAt,
				orderName,
				dealStatus,
				price,
				payedPrice,
				payFee,
				income,
				taxes,
				profit,
				otherFee,
				netProfit,
				managerName,
				city,
				payedBy,
				promocodeUsed,
				promoCompany,
				utmSource,
				utmMedium,
				utmCampaign,
				utmContent,
				utmTerm,
				utmGroup,
				workWithOrder,
				orderComments,
				rejectReason,
				orderTag,
			},
		});
	}

	async findOrderDb(idSystemGc: number): Promise<OrderModel | null> {
		return this.prismaService.client.orderModel.findFirst({
			where: {
				idSystemGc,
			},
		});
	}

	async createNullOrderDb({
		idSystemGc,
		idAzatGc,
		idUserGc,
		userName,
		userEmail,
		userPhone,
		createdAt,
		payedAt,
		orderName,
		dealStatus,
		price,
		payedPrice,
		payFee,
		income,
		taxes,
		profit,
		otherFee,
		netProfit,
		managerName,
		city,
		payedBy,
		promocodeUsed,
		promoCompany,
		utmSource,
		utmMedium,
		utmCampaign,
		utmContent,
		utmTerm,
		utmGroup,
		workWithOrder,
		orderComments,
		rejectReason,
		orderTag,
	}: Order): Promise<NullOrderModel> {
		return this.prismaService.client.nullOrderModel.create({
			data: {
				idSystemGc,
				idAzatGc,
				idUserGc,
				userName,
				userEmail,
				userPhone,
				createdAt,
				payedAt,
				orderName,
				dealStatus,
				price,
				payedPrice,
				payFee,
				income,
				taxes,
				profit,
				otherFee,
				netProfit,
				managerName,
				city,
				payedBy,
				promocodeUsed,
				promoCompany,
				utmSource,
				utmMedium,
				utmCampaign,
				utmContent,
				utmTerm,
				utmGroup,
				workWithOrder,
				orderComments,
				rejectReason,
				orderTag,
			},
		});
	}
	async findNullOrderDb(idSystemGc: number): Promise<NullOrderModel | null> {
		return this.prismaService.client.nullOrderModel.findFirst({
			where: {
				idSystemGc,
			},
		});
	}
	async updateNullOrderDb(
		id: number,
		{
			userName,
			userEmail,
			userPhone,
			payedAt,
			orderName,
			dealStatus,
			price,
			payedPrice,
			payFee,
			income,
			taxes,
			profit,
			otherFee,
			netProfit,
			managerName,
			utmSource,
			utmMedium,
			utmCampaign,
			utmContent,
			utmTerm,
			utmGroup,
			workWithOrder,
			orderComments,
			rejectReason,
			orderTag,
		}: Order,
	): Promise<OrderModel> {
		return this.prismaService.client.nullOrderModel.update({
			where: {
				id,
			},
			data: {
				userName,
				userEmail,
				userPhone,
				payedAt,
				orderName,
				dealStatus,
				price,
				payedPrice,
				payFee,
				income,
				taxes,
				profit,
				otherFee,
				netProfit,
				managerName,
				utmSource,
				utmMedium,
				utmCampaign,
				utmContent,
				utmTerm,
				utmGroup,
				workWithOrder,
				orderComments,
				rejectReason,
				orderTag,
			},
		});
	}

	async updateOrderDb(
		id: number,
		{
			userName,
			userEmail,
			userPhone,
			payedAt,
			orderName,
			dealStatus,
			price,
			payedPrice,
			payFee,
			income,
			taxes,
			profit,
			otherFee,
			netProfit,
			managerName,
			utmSource,
			utmMedium,
			utmCampaign,
			utmContent,
			utmTerm,
			utmGroup,
			workWithOrder,
			orderComments,
			rejectReason,
			orderTag,
		}: Order,
	): Promise<OrderModel> {
		return this.prismaService.client.orderModel.update({
			where: {
				id,
			},
			data: {
				userName,
				userEmail,
				userPhone,
				payedAt,
				orderName,
				dealStatus,
				price,
				payedPrice,
				payFee,
				income,
				taxes,
				profit,
				otherFee,
				netProfit,
				managerName,
				utmSource,
				utmMedium,
				utmCampaign,
				utmContent,
				utmTerm,
				utmGroup,
				workWithOrder,
				orderComments,
				rejectReason,
				orderTag,
			},
		});
	}
}
