// googleSheetService.ts
import { google } from 'googleapis';
import * as fs from 'fs';
import { OAuth2Client } from 'google-auth-library';
import { ICredentials } from './credentials.interface';

export class GoogleSheetService {
	private client: OAuth2Client;
	private spreadsheetId: string;
	//в конструкторе описываем авторизацию клиента
	constructor() {
		try {
			// Чтение учетных данных из файла JSON
			const credentials: ICredentials = JSON.parse(
				fs.readFileSync(
					'C:/myLaptop/arman.js.programming/azatvaleev-work/getcourse-sales-id/src/sales/credentials.json',
					'utf-8',
				),
			);
			// Аутентификация с использованием учетных данных
			const auth = new google.auth.GoogleAuth({
				credentials: {
					client_email: credentials.client_email,
					private_key: credentials.private_key,
				},
				scopes: [
					'https://www.googleapis.com/auth/spreadsheets',
					'https://www.googleapis.com/auth/drive',
				],
			});
			//Вызов метода инициализации клиента
			this.initializeClient(auth);
		} catch (error) {
			console.error('Произошла ошибка:', error);
		}
	}
	//Метод инициализации клиента
	private async initializeClient(auth: any) {
		try {
			this.client = await auth.getClient();
		} catch (error) {
			console.error('Произошла ошибка при инициализации клиента:', error);
		}
	}
	//Метод проверки нового запроса на запись в таблицу
	public async handleNewRequest(data: string[]) {
		const spreadsheet = JSON.parse(
			fs.readFileSync(
				'C:/myLaptop/arman.js.programming/azatvaleev-work/getcourse-sales-id/src/sales/spreadsheet.json',
				'utf-8',
			),
		);
		this.spreadsheetId = spreadsheet.spreadsheetId;
		console.log(this.spreadsheetId);
		//проверяем существует ли идентификатор таблицы
		if (!this.spreadsheetId) {
			this.createTable();
		}
		// Проверяем, прошло ли уже 10 секунд с момента создания последней таблицы
		if (this.spreadsheetId !== null) {
			// Используем существующую таблицу
			console.log(`Запись в существующую таблицу`);
			this.writeDataToTable(data, this.spreadsheetId);
		}
		return this.spreadsheetId;
	}
	//Метод действия на завершение таймера
	public async timerEnd() {
		const jsonSpreadFile = {
			spreadsheetId: null,
		};
		this.updateTableId(jsonSpreadFile);
	}
	//Метод обновления ID таблицы
	private async updateTableId(data: {}) {
		try {
			// Чтение JSON файла
			const spreadsheet = JSON.parse(
				fs.readFileSync(
					`C:/myLaptop/arman.js.programming/azatvaleev-work/getcourse-sales-id/src/sales/spreadsheet.json`,
					'utf-8',
				),
			);
			// Обновление данных в JSON объекте
			spreadsheet.spreadsheet_id = data;
			// Запись обновленных данных обратно в файл
			fs.writeFileSync(
				`C:/myLaptop/arman.js.programming/azatvaleev-work/getcourse-sales-id/src/sales/spreadsheet.json`,
				JSON.stringify(data, null, 2),
			);
			console.log('JSON file updated successfully.');
		} catch (error) {
			console.error('Error updating JSON file:', error);
		}
	}
	//Метод создания таблицы
	public async createTable() {
		//создание гугл таблицы
		console.log(`Создание новой таблицы...`);
		// Создание клиента для доступа к API Google Sheets
		const sheets = google.sheets({ version: 'v4', auth: this.client });
		const currentData = new Date();
		const spreadTitle = `Стратегические сессии ${currentData.toLocaleString()}`;
		const sheetTitle = `Sheet1`;
		// Запрос на создание новой таблицы
		const response = await sheets.spreadsheets.create({
			requestBody: {
				properties: {
					title: spreadTitle, // Укажите желаемое название таблицы
				},
				sheets: [
					{
						properties: {
							title: sheetTitle,
						},
					},
				],
			},
		});
		// Вывод информации о созданной таблице
		console.log(`Таблица "${spreadTitle}" успешно создана: ${response.data.spreadsheetId}
        ${response.data.spreadsheetUrl}`);
		// Получаем ID созданной таблицы
		const spreadsheetId = response.data.spreadsheetId;
		// Дать доступ к таблице
		const drive = google.drive({ version: 'v3', auth: this.client });
		await drive.permissions.create({
			fileId: spreadsheetId || undefined,
			requestBody: {
				role: 'writer',
				type: 'user',
				emailAddress: 'armansk8er@gmail.com',
			},
		});
		console.log('Доступ к таблице успешно предоставлен.');
		const jsonSpreadFile = {
			spreadsheetId: spreadsheetId,
		};
		this.updateTableId(jsonSpreadFile);
		return spreadsheetId;
	}
	//Метод записи в таблицу
	public async writeDataToTable(data: string[], spreadsheetId: any) {
		const sheets = google.sheets({ version: 'v4', auth: this.client });
		try {
			// Диапазон в таблице, куда вы хотите добавить данные
			const range = 'A1:B1'; // Например, добавление в первую строку
			// Данные, которые вы хотите добавить
			const values: any[][] = [data];
			// Выполнение запроса на добавление данных
			const response = await sheets.spreadsheets.values.append({
				spreadsheetId,
				range,
				valueInputOption: 'RAW',
				requestBody: {
					values,
				},
			});
			console.log('Данные успешно добавлены:', response.data);
		} catch (error) {
			console.error('Произошла ошибка при добавлении данных:', error);
		}
	}
	//Метод чтения диапозона из таблицы. Необходимо передать ID таблицы и диапозон в формате 'Sheet1!A1:B10'
	public async readDataFromTable(spreadsheetId: string, range: string) {
		const sheets = google.sheets({ version: 'v4', auth: this.client });
		try {
			// Выполнение запроса на чтение данных
			const response = await sheets.spreadsheets.values.get({
				spreadsheetId,
				range,
			});
			// Возвращаем полученные данные
			return response.data;
		} catch (error) {
			console.error('Произошла ошибка при чтении данных из таблицы:', error);
			return null; // В случае ошибки возвращаем null или другое значение по умолчанию
		}
	}
	//Метод удаления таблицы. Необходимо указать ID таблицы. Удаляет основную страницу
	public async deleteTable(spreadsheetId: string) {
		const sheets = google.sheets({ version: 'v4', auth: this.client });
		try {
			// Выполнение запроса на удаление таблицы
			await sheets.spreadsheets.batchUpdate({
				spreadsheetId,
				requestBody: {
					requests: [
						{
							deleteSheet: {
								sheetId: 0, // ID листа, который нужно удалить. 0 - основной лист (Sheet1)
							},
						},
					],
				},
			});
			console.log('Таблица успешно удалена.');
		} catch (error) {
			console.error('Произошла ошибка при удалении таблицы:', error);
		}
	}
	//Метод удаления таблицы. Необходимо указать ID таблицы. Удаляет основную страницу
	public async deleteDataFromTable(spreadsheetId: string, range: any) {
		const sheets = google.sheets({ version: 'v4', auth: this.client });
		try {
			// Выполнение запроса на удаление таблицы
			await sheets.spreadsheets.batchUpdate({
				spreadsheetId,
				requestBody: {
					requests: [
						{
							deleteRange: {
								range: range,
							},
						},
					],
				},
			});
			console.log('Данные успешно удалены.');
		} catch (error) {
			console.error('Произошла ошибка при удалении данных:', error);
		}
	}
	// Метод обновления данных в таблице
	public async updateDataInTable(data: string[][], spreadsheetId: string, range: string) {
		const sheets = google.sheets({ version: 'v4', auth: this.client });
		try {
			// Очистка существующих данных
			await sheets.spreadsheets.values.clear({
				spreadsheetId,
				range,
			});

			// Запись новых данных
			const response = await sheets.spreadsheets.values.append({
				spreadsheetId,
				range,
				valueInputOption: 'RAW',
				requestBody: {
					values: data,
				},
			});
			console.log('Данные успешно обновлены:', response.data);
		} catch (error) {
			console.error('Произошла ошибка при обновлении данных:', error);
		}
	}
}
