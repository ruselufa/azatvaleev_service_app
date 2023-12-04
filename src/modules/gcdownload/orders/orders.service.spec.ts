import 'reflect-metadata';
import { Container } from 'inversify';
import { IConfigService } from '../../../config/config.service.interface';
import { IOrdersRepository } from './orders.repository.interface';
import { IOrdersService } from './orders.service.interface';
import { TYPES } from '../../../types';
import { OrdersService } from './orders.service';
import { ExportId } from './orders.exportid.entity';
import { ILogger } from '../../../logger/logger.interface';
import { ExportModel } from '@prisma/client';
import axios, { Axios, AxiosResponse } from 'axios';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};
const OrdersRepositoryMock: IOrdersRepository = {
	createExportIdDb: jest.fn(),
	findExportIdDb: jest.fn(),
	findStatusExportId: jest.fn(),
	updateStatusExportId: jest.fn(),
	createOrderDb: jest.fn(),
	updateOrderDb: jest.fn(),
	findOrderDb: jest.fn(),
	createNullOrderDb: jest.fn(),
	updateNullOrderDb: jest.fn(),
	findNullOrderDb: jest.fn(),
};

const LoggerServiceMock: ILogger = {
	log: jest.fn(),
	warn: jest.fn(),
	error: jest.fn(),
	logger: undefined,
};

const container = new Container();
let configService: IConfigService;
let ordersRepository: IOrdersRepository;
let ordersService: IOrdersService;
let loggerService: ILogger;
let createdExportId: ExportModel | null;

beforeAll(() => {
	container.bind<IOrdersService>(TYPES.OrdersService).to(OrdersService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IOrdersRepository>(TYPES.OrdersRepository).toConstantValue(OrdersRepositoryMock);
	container.bind<ILogger>(TYPES.ILogger).toConstantValue(LoggerServiceMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	ordersRepository = container.get<IOrdersRepository>(TYPES.OrdersRepository);
	ordersService = container.get<IOrdersService>(TYPES.OrdersService);
	loggerService = container.get<ILogger>(TYPES.ILogger);
});

describe('Orders service', () => {
	it('createExportID', async () => {
		ordersRepository.createExportIdDb = jest.fn().mockImplementationOnce(
			(newExport: ExportId): ExportModel => ({
				id: 3,
				name: newExport.name,
				gcId: newExport.gcId,
				status: newExport.status,
				createdDate: newExport.createdDate,
				finishedDate: newExport.finishedDate,
			}),
		);
		ordersService.requestExportId = jest
			.fn()
			.mockImplementationOnce(async (): Promise<AxiosResponse | undefined> => {
				const apiKey = configService.get('GC_API_KEY');
				const PREFIX = configService.get('GC_PREFIX');
				const result = await axios.get(
					`https://azatvaleev.getcourse.ru/pl/api/account/deals?key=lMPb6M7lh3nNp94uf9KAREkeBybTHVE1ZP9Fcj0I81C6EMr79TuVYHCI3lnpwnn6Su7uUh5baosjO2SHZvpfeLQRfqjTCAp8lk8IPRVatDYoYdCkbCfKJD1H8JKxonFn&created_at[from]=2023-12-04&created_at[to]=2023-12-04`,
				);
				console.log(result);
				return result;
			});
		const createdOrder = await ordersService.createExportId(3, 600000);
		// console.log(createdOrder);
		// expect(ordersService.requestExportId).toHaveBeenCalled();
		expect(ordersRepository.createExportIdDb).toHaveBeenCalled();
	});
});
