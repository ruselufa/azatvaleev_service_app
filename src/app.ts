import express, { Express } from 'express';
import { Server } from 'http';
import { ILogger } from './logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import 'reflect-metadata';
import { json } from 'body-parser';
import { IConfigService } from './config/config.service.interface';
import { IExceptionFilter } from './error/exception.filter.interface';
import { UserController } from './users/users.controller';
import { PurchasesController } from './modules/distribution_bot/purchases/purchases.controller';
import { PrismaService } from './database/prisma.service';
import { AuthMiddleware } from './common/auth.middleware';
import { UsersEnkodController } from './modules/enkod/users/users.controller';
import { OrdersController } from './modules/gcdownload/orders/orders.controller';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;
	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.PurchasesController) private purchasesController: PurchasesController,
		@inject(TYPES.UsersEnkodController) private usersEnkodController: UsersEnkodController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		@inject(TYPES.OrdersController) private ordersController: OrdersController,
	) {
		this.app = express();
		this.port = 8000;
	}
	useMiddleware(): void {
		this.app.use(json());
		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
		this.app.use(authMiddleware.execute.bind(this));
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
		this.app.use('/api/purchases', this.purchasesController.router);
		this.app.use('/api/enkod', this.usersEnkodController.router);
		this.ordersController.requireExportId();
		this.ordersController.exportOrders();
	}
	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}
	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
	}
	public close(): void {
		this.server.close();
	}
}
