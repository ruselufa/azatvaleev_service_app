// googleSheetService.ts
import { google } from "googleapis";
import path from "path";
import * as fs from 'fs';
import { OAuth2Client } from "google-auth-library";
import { ICredentials } from "./credentials.interface"; 
import { ISpreadsheet } from "./spreadsheet.interface"; 

export class GoogleSheetRepository {

    private client: OAuth2Client;
    private spreadsheetId: string;

    constructor() {

        try {
            // Чтение учетных данных из файла JSON
            const credentials: ICredentials = JSON.parse(fs.readFileSync('C:/myLaptop/arman.js.programming/azatvaleev-work/getcourse-sales-id/src/sales/credentials.json', 'utf-8'));
            // Аутентификация с использованием учетных данных
            const auth = new google.auth.GoogleAuth({
                credentials: {
                  client_email: credentials.client_email,
                  private_key: credentials.private_key,
                },
                scopes: ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive"],
              });
              auth.getClient().then(() => {
                this.initializeClient(auth);
                
            }).catch(error => {
            console.error('Произошла ошибка при получении клиента:', error);
        });
        } catch (error) {
        console.error('Произошла ошибка:', error);
        }
    }

    private async initializeClient(auth: any) {
        try {
            this.client = await auth.getClient();
        } catch (error) {
            console.error('Произошла ошибка при инициализации клиента:', error);
        }
    }

    public async handleNewRequest(data: string[]) {
        const spreadsheet = JSON.parse(fs.readFileSync('C:/myLaptop/arman.js.programming/azatvaleev-work/getcourse-sales-id/src/sales/spreadsheet.json', 'utf-8'));
        this.spreadsheetId = spreadsheet.spreadsheetId;
        console.log(this.spreadsheetId)
        //проверяем существует ли идентификатор таблицы
        if (!this.spreadsheetId){
            this.createGoogleSheet();
        }
        // Проверяем, прошло ли уже 10 секунд с момента создания последней таблицы
        if (this.spreadsheetId !== null) {
            // Используем существующую таблицу
            console.log(`Запись в существующую таблицу`);
            this.writeDataToExistingTable(data, this.spreadsheetId)
        } 
    }
    
    public async timerEnd() {
        const jsonSpreadFile = {
            spreadsheetId: null
        }
    
        this.updateSpreadsheetId(jsonSpreadFile)
    }

    public async createGoogleSheet() { //создание гугл таблицы
            console.log(`Создание новой таблицы...`)
        
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
                    sheets: [{
                        properties: {
                            title: sheetTitle,
                        }
                    }]
                }
            });
        
            // Вывод информации о созданной таблице
            console.log(`Таблица "${spreadTitle}" успешно создана: ${response.data.spreadsheetId}
            ${response.data.spreadsheetUrl}`);
        
            // Получаем ID созданной таблицы
            const spreadsheetId = response.data.spreadsheetId;;
    
            // Дать доступ к таблице
            const drive = google.drive({ version: 'v3', auth: this.client });
            
            await drive.permissions.create({
                fileId: spreadsheetId || undefined,
                requestBody: { 
                    role: 'writer', 
                    type: 'user',
                    emailAddress: 'armansk8er@gmail.com' }
            });
        
        console.log('Доступ к таблице успешно предоставлен.');

            const jsonSpreadFile = {
                spreadsheetId: spreadsheetId
            }
        
            this.updateSpreadsheetId(jsonSpreadFile)
        return spreadsheetId;
    } 
    

    public async writeDataToExistingTable(data: string[], spreadsheetId: any) {
        
        const sheets = google.sheets({ version: 'v4', auth: this.client });

        try {
            // Диапазон в таблице, куда вы хотите добавить данные
            const range = "A1:B1"; // Например, добавление в первую строку

            // Данные, которые вы хотите добавить
            const values: any[][] = [data];

            // Выполнение запроса на добавление данных
            const response = await sheets.spreadsheets.values.append({
                spreadsheetId,
                range,
                valueInputOption: "RAW",
                requestBody: {
                    values,
                }
            });

            console.log("Данные успешно добавлены:", response.data);
        } catch (error) {
            console.error("Произошла ошибка при добавлении данных:", error);
        }
    };

    public async writeDataToNewTable(data: string[], spreadsheetId: any) {
        
        const sheets = google.sheets({ version: 'v4', auth: this.client });

        try {
            // Диапазон в таблице, куда вы хотите добавить данные
            const range = "A1:B1"; // Например, добавление в первую строку

            // Данные, которые вы хотите добавить
            const values: any[][] = [data];

            // Выполнение запроса на добавление данных
            const response = await sheets.spreadsheets.values.append({
                spreadsheetId,
                range,
                valueInputOption: "RAW",
                requestBody: {
                    values,
                }
            });

            console.log("Данные успешно добавлены:", response.data.spreadsheetId);
        } catch (error) {
            console.error("Произошла ошибка при добавлении данных:", error);
        }
    };

    private async updateSpreadsheetId(data: {}) {
        try {
            // Чтение JSON файла
            const spreadsheet = JSON.parse(fs.readFileSync(`C:/myLaptop/arman.js.programming/azatvaleev-work/getcourse-sales-id/src/sales/spreadsheet.json`, 'utf-8'));
    
            // Обновление данных в JSON объекте
            spreadsheet.spreadsheet_id = data;
    
            // Запись обновленных данных обратно в файл
            fs.writeFileSync(`C:/myLaptop/arman.js.programming/azatvaleev-work/getcourse-sales-id/src/sales/spreadsheet.json`, JSON.stringify(data, null, 2));
    
            console.log('JSON file updated successfully.');
        } catch (error) {
            console.error('Error updating JSON file:', error);
        }
    }
}




