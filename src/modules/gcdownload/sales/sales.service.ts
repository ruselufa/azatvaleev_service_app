import { inject, injectable } from 'inversify';
import { GoogleSheetService } from '../../googlesheet/googleSheet.repository';
import { SaleCreateDto } from './dto/sales-create.dto';
import moment from 'moment';
import * as fs from 'fs';
import { TYPES } from '../../../types';
import 'reflect-metadata';

@injectable()
export class SalesService {
	private endTime: moment.Moment | null = null;
	private timerInterval: NodeJS.Timeout | null = null;

	constructor(@inject(TYPES.GoogleSheetService) private googleSheetService: GoogleSheetService) {}

	public async googleSheetsGetSalesData(data: SaleCreateDto): Promise<moment.Moment> {
		const duration = moment.duration(5, 'seconds');
		// Установка времени окончания таймера на текущее время плюс указанную длительность
		this.endTime = moment().add(duration);
		// Если уже существует интервал таймера, он очищается
		if (this.timerInterval) {
			clearInterval(this.timerInterval);
		}
		// Запуск интервала и проверка на окончание
		this.timerInterval = setInterval(async () => {
			if (this.endTime !== null) {
				const remainingTime = moment.duration(this.endTime.diff(moment()));
				if (remainingTime.asSeconds() <= 0) {
					if (this.timerInterval !== null) {
						clearInterval(this.timerInterval);
						await this.googleSheetService.handleNewRequest(); // Вызываем метод обработки после завершения таймера
					}
					// Здесь таймер завершен, выполните код, который нужно выполнить после окончания таймера
					console.log('Timer has ended');
				}
			}
		}, 1000);
		// Установка нового интервала таймера, который каждую секунду проверяет оставшееся время
		if (this.endTime) {
			//Запуск процесса записи в таблицу
			// const spreadsheetId = await this.googleSheetService.handleNewRequest([fullName, phone, id]);
			const csvData: string[] = [];
			const fileExists = fs.existsSync('./src/sales/salesData.csv');
			// Проверка на существующий файл CSV
			if (!fileExists) {
				csvData.push('ID;Name;Price');
			}
			// Записываем данные в CSV
			for (const entry of [data]) {
				csvData.push(
					`${'https://azatvaleev.getcourse.ru/sales/control/deal/update/id/' + entry.id};
					${entry.fullname};
					${entry.phone}`,
				);
			}
			// Добавляем новые строки в файл без перезаписи
			try {
				fs.appendFileSync('./src/sales/salesData.csv', csvData.join('\n') + '\n', 'utf-8');
				console.log('Данные успешно добавлены в файл sales.csv');
			} catch (error) {
				console.error('Ошибка при добавлении данных в файл:', error);
			}
		}
		return this.endTime;
	}
}
