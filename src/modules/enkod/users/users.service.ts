import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types';
import { IConfigService } from '../../../config/config.service.interface';
import { UserCreateDto } from './dto/user-create.dto';
import { IUsersEnkodService } from './users.service.interface';
import { User } from './users.entity';
import { IUsersEnkodRepository } from './users.repository.interface';
import { UserExceptionModel } from '@prisma/client';
import { isNumber, isString } from 'class-validator';

@injectable()
export class UsersEnkodService implements IUsersEnkodService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersEnkodRepository) private usersEnkodRepository: IUsersEnkodRepository,
	) {}
	async createUser({
		gcUserId,
		email,
		firstName,
		lastName,
		gcOrderId,
		positionsInOrder,
		createdAtOrder,
		statusOrder,
	}: UserCreateDto): Promise<UserExceptionModel | null> {
		const newUser = new User(
			gcUserId,
			email,
			firstName,
			lastName,
			gcOrderId,
			positionsInOrder,
			createdAtOrder,
			statusOrder,
		);
		return this.usersEnkodRepository.create(newUser);
	}
}
