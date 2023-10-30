import { App } from './app';
import { LoggerService } from './logger/logger.service';
import { UserController } from './users/users.controller';
import { ExceptionFilter } from './error/exception.filter';
import { Container, ContainerModule, interfaces } from 'inversify';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { IExceptionFilter } from './error/exception.filter.interface';
import { UserService } from './users/users.service';
import { IUsersService } from './users/users.service.interface';
import { IUserController } from './users/users.controller.interface';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { PrismaService } from './database/prisma.service';
import { UsersRepository } from './users/users.repository';
import { IUsersRepository } from './users/users.repository.interface';
import { PurchaseService } from './modules/distribution_bot/purchases/purchases.service';
import { IPurchasesService } from './modules/distribution_bot/purchases/purchases.service.interface';
import { IPurchasesControllerInterface } from './modules/distribution_bot/purchases/purchases.controller.interface';
import { PurchasesController } from './modules/distribution_bot/purchases/purchases.controller';
import { IPurchaseRepository } from './modules/distribution_bot/purchases/purchases.repository.interface';
import { PurchasesRepository } from './modules/distribution_bot/purchases/purchases.repository';
import { IUsersEnkodControllerInterface } from './modules/enkod/users/users.controller.interface';
import { IUsersEnkodService } from './modules/enkod/users/users.service.interface';
import { IUsersEnkodRepository } from './modules/enkod/users/users.repository.interface';
import { UsersEnkodController } from './modules/enkod/users/users.controller';
import { UsersEnkodService } from './modules/enkod/users/users.service';
import { UsersEnkodRepository } from './modules/enkod/users/users.repository';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<IUserController>(TYPES.UserController).to(UserController);
	bind<IUsersService>(TYPES.UserService).to(UserService);
	bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<IPurchasesControllerInterface>(TYPES.PurchasesController).to(PurchasesController);
	bind<IPurchasesService>(TYPES.PurchasesService).to(PurchaseService);
	bind<IPurchaseRepository>(TYPES.PurchasesRepository).to(PurchasesRepository).inSingletonScope();
	bind<IUsersEnkodControllerInterface>(TYPES.UsersEnkodController).to(UsersEnkodController);
	bind<IUsersEnkodService>(TYPES.UsersEnkodService).to(UsersEnkodService);
	bind<IUsersEnkodRepository>(TYPES.UsersEnkodRepository)
		.to(UsersEnkodRepository)
		.inSingletonScope();
	bind<App>(TYPES.Application).to(App);
});

async function bootstrap(): Promise<IBootstrapReturn> {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	await app.init();
	return { appContainer, app };
}

export const boot = bootstrap();
