import { inject, injectable } from 'inversify';
import { UserExceptionModel } from '@prisma/client';
import { TYPES } from '../../../types';
import { PrismaService } from '../../../database/prisma.service';
import { IUsersEnkodRepository } from './users.repository.interface';
import { User } from './users.entity';

@injectable()
export class UsersEnkodRepository implements IUsersEnkodRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}
	async create({
		gcUserId,
		email,
		firstName,
		lastName,
		gcOrderId,
		positionsInOrder,
		createdAtOrder,
		statusOrder,
	}: User): Promise<UserExceptionModel> {
		return this.prismaService.client.userExceptionModel.create({
			data: {
				gcUserId,
				email,
				firstName,
				lastName,
				gcOrderId,
				positionsInOrder,
				createdAtOrder,
				statusOrder,
			},
		});
	}

	async find(email: string): Promise<UserExceptionModel | null> {
		return this.prismaService.client.userExceptionModel.findFirst({
			where: {
				email,
			},
		});
	}
}
