import 'reflect-metadata';
import { Container } from 'inversify';
import { IConfigService } from '../../../config/config.service.interface';
import { IOrdersRepository } from './orders.repository.interface';
import { IOrdersService } from './orders.service.interface';
import { TYPES } from '../../../types';
import { OrdersService } from './orders.service';
import { ExportId } from './orders.exportid.entity';
import { ILogger } from '../../../logger/logger.interface';

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

const loggerServiceMock: ILogger = {
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

beforeAll(() => {
	container.bind<IOrdersService>(TYPES.OrdersService).to(OrdersService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IOrdersRepository>(TYPES.OrdersRepository).toConstantValue(OrdersRepositoryMock);
	container.bind<ILogger>(TYPES.ILogger).toConstantValue(loggerServiceMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	ordersRepository = container.get<IOrdersRepository>(TYPES.OrdersRepository);
	ordersService = container.get<IOrdersService>(TYPES.OrdersService);
});

describe('Orders service', () => {
	it('createOrder', async () => {
		configService.get = jest.fn().mockRejectedValueOnce('1');
		ordersRepository.createExportIdDb = jest.fn().mockImplementationOnce((newExport: ExportId) => ({
			name: newExport.name,
			gcId: newExport.gcId,
			status: newExport.status,
			createdDate: newExport.createdDate,
			finishedDate: newExport.finishedDate,
		}));
		const createdOrder = await ordersService.createExportId(3, 600000);
		expect(createdOrder).toBeGreaterThan(0);
	});
});
