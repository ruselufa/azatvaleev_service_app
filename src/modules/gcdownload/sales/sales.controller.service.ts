import { injectable } from 'inversify';
import { GoogleSheetService } from '../../googlesheet/googleSheet.service';
import { SaleCreateDto } from './dto/sales-create.dto';
import { ISaleData } from './sales.interface';
import moment from 'moment';
import 'reflect-metadata';
import * as fs from 'fs';

@injectable()
export class SalesControllerService {
	private googleSheetService: GoogleSheetService;
	private endTime: moment.Moment | null = null;
	private timerInterval: NodeJS.Timeout | null = null;

	constructor() {
		this.googleSheetService = new GoogleSheetService();
	}

	public async googleSheetsGetSalesData(data: SaleCreateDto): Promise<void> {
		const id = 'https://azatvaleev.getcourse.ru/sales/control/deal/update/id/' + data.id;
		const fullName = data.fullname;
		const phone = data.phone;

		const duration = moment.duration(30, 'seconds');
		// Установка времени окончания таймера на текущее время плюс указанную длительность
		this.endTime = moment().add(duration);

		// Если уже существует интервал таймера, он очищается
		if (this.timerInterval) {
			clearInterval(this.timerInterval);
		}

		this.timerInterval = setInterval(() => {
			if (this.endTime !== null) {
				const remainingTime = moment.duration(this.endTime.diff(moment()));
				if (remainingTime.asSeconds() <= 0) {
					if (this.timerInterval !== null) {
						clearInterval(this.timerInterval);
					}
					console.log('Timer has ended');
					// Здесь таймер завершен, выполните код, который нужно выполнить после окончания таймера
					this.googleSheetService.timerEnd(); // Вызываем метод обработки после завершения таймера
				}
			}
		}, 1000);

		// Установка нового интервала таймера, который каждую секунду проверяет оставшееся время
		if (this.endTime) {
			//Запуск процесса записи в таблицу
			const checkRequest = this.googleSheetService.handleNewRequest([fullName, phone, id]);
		}
	}

	public async writeDataToCsv(data: ISaleData[]): Promise<void> {
		const csvData: string[] = [];
		const fileExists = fs.existsSync('./src/sales/salesData.csv');

		const duration = moment.duration(30, 'seconds');
		// Установка времени окончания таймера на текущее время плюс указанную длительность
		this.endTime = moment().add(duration);

		// Если уже существует интервал таймера, он очищается
		if (this.timerInterval) {
			clearInterval(this.timerInterval);
		}

		// Если файла нет, добавляем заголовки столбцов
		if (!fileExists) {
			csvData.push('ID;Name;Price');
		}

		this.timerInterval = setInterval(() => {
			if (this.endTime !== null) {
				const remainingTime = moment.duration(this.endTime.diff(moment()));
				if (remainingTime.asSeconds() <= 0) {
					if (this.timerInterval !== null) {
						clearInterval(this.timerInterval);
					}
					console.log('Timer has ended');
					try {
						// Укорачиваем файл до нулевой длины, что очищает его содержимое
						fs.unlinkSync('./src/sales/salesData.csv');
						console.log('Файл успешно удален');
					} catch (error) {
						console.error('Ошибка при удалении файла:', error);
					}
				}
			}
		}, 1000);

		// Установка нового интервала таймера, который каждую секунду проверяет оставшееся время
		if (this.endTime) {
			// Записываем данные в CSV
			for (const entry of data) {
				csvData.push(`${entry.id};${entry.fullname};${entry.phone}`);
			}

			// Добавляем новые строки в файл без перезаписи
			try {
				fs.appendFileSync('./src/sales/salesData.csv', csvData.join('\n') + '\n', 'utf-8');
				console.log('Данные успешно добавлены в файл sales.csv');
			} catch (error) {
				console.error('Ошибка при добавлении данных в файл:', error);
			}
		}
	}
}
