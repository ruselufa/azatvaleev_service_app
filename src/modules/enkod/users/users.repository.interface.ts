import { UserExceptionModel } from '@prisma/client';
import { User } from './users.entity';

export interface IUsersEnkodRepository {
	create: (user: User) => Promise<UserExceptionModel>;
	find: (email: string) => Promise<UserExceptionModel | null>;
}