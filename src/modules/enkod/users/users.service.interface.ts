import { UserExceptionModel } from '@prisma/client';
import { UserCreateDto } from './dto/user-create.dto';

export interface IUsersEnkodService {
	createUser: (user: UserCreateDto) => Promise<UserExceptionModel | null>;
}
