/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Response, Request, NextFunction } from 'express';
import { BaseController } from '../../../../common/base.controller';
import { LoggerService } from '../../../../logger/logger.service';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { SaleCreateDto } from './dto/sales-create.dto';
import { SalesControllerService } from './sales.controller.service';
import { GoogleSheetRepository } from './google.sheet.repository';
import moment from 'moment';

export class SalesController extends BaseController {
	salesControllerService: SalesControllerService;
	googleSheetRepository: GoogleSheetRepository;
	endTime: moment.Moment | null = null; // Переменная для хранения времени окончания таймера
	timerInterval: NodeJS.Timeout | null = null; // Явное указание типа для переменной timerInterval
	cancelTimeout: NodeJS.Timeout | null = null;
	requestCounter = 0;

	path: string;
	func: (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction,
	) => void;
	method: 'get' | 'post' | 'delete' | 'patch' | 'put';

	private SalesControllerService: SalesControllerService;
	private GoogleSheetRepository: GoogleSheetRepository;

	constructor(logger: LoggerService, googoo: GoogleSheetRepository) {
		super(logger);
		this.endTime = null;
		this.timerInterval = null;
		this.cancelTimeout = null;
		this.salesControllerService = new SalesControllerService();
		this.googleSheetRepository = new GoogleSheetRepository();
		this.bindRoutes([
			{ path: '/get', method: 'get', func: this.apiRecieve },

			{ path: '/post', method: 'post', func: this.post },
		]);
	}

	async apiRecieve(req: Request<{}, {}, SaleCreateDto>, res: Response, next: NextFunction) {
		const transferObject: SaleCreateDto = {
			id: String(req.query.id),
			firstname: String(req.query.firstName),
			lastname: String(req.query.lastName),
			phone: String(req.query.phone),
		};

		const id = 'https://azatvaleev.getcourse.ru/sales/control/deal/update/id/' + transferObject.id;
		const fullName = transferObject.firstname + transferObject.lastname;
		const phone = transferObject.phone;

		const duration = moment.duration(30, 'seconds');
		// Установка времени окончания таймера на текущее время плюс указанную длительность
		this.endTime = moment().add(duration);

		// Если уже существует интервал таймера, он очищается
		if (this.timerInterval) {
			clearInterval(this.timerInterval);
		}

		// Вычисление оставшегося времени до окончания таймера
		const remainingTime = moment.duration(this.endTime.diff(moment()));

		this.timerInterval = setInterval(() => {
			if (this.endTime !== null) {
				const remainingTime = moment.duration(this.endTime.diff(moment()));
				if (remainingTime.asSeconds() <= 0) {
					if (this.timerInterval !== null) {
						clearInterval(this.timerInterval);
					}
					console.log('Timer has ended');
					// Здесь таймер завершен, выполните код, который нужно выполнить после окончания таймера
					this.googleSheetRepository.timerEnd(); // Вызываем метод обработки после завершения таймера
				}
			}
		}, 1000);

		// Установка нового интервала таймера, который каждую секунду проверяет оставшееся время
		if (this.endTime) {
			//Запуск процесса записи в таблицу
			const createTable = this.googleSheetRepository.handleNewRequest([fullName, phone, id]);
		}

		this.ok(res, 'it get');
	}

	post(req: Request, res: Response, next: NextFunction) {
		this.ok(res, 'it post');
	}
}
