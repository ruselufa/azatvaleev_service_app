import { GoogleSheetService } from '../../googlesheet/googleSheet.service';
import { SaleCreateDto } from './dto/sales-create.dto';
import moment from 'moment';

export class SalesControllerService {
	private googleSheetService: GoogleSheetService;
	private endTime: moment.Moment | null = null;
	private timerInterval: NodeJS.Timeout | null = null;

	constructor() {
		this.googleSheetService = new GoogleSheetService();
	}

	public async googleSheetsGetSalesData(data: SaleCreateDto) {
		const id = 'https://azatvaleev.getcourse.ru/sales/control/deal/update/id/' + data.id;
		const fullName = data.firstname + data.lastname;
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
		return this.endTime;
	}
}
