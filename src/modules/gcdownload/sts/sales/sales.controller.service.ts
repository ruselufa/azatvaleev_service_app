import { appendFile } from "fs/promises";
import { join } from "path";
import { GoogleSheetRepository } from "./google.sheet.repository";

export class SalesControllerService {
    googleSheetRepository: GoogleSheetRepository;

    constructor() {
        // Инициализация googleSheetRepository
        this.googleSheetRepository = new GoogleSheetRepository();
    }
    
    public async getCreatedIdInfo(
        id: string, 
        firstName: string, 
        lastName: string, 
        phone: string) {
            const url = 'https://online.azat-valeev.ru/sales/control/deal/update/id/' + id;
            const fullName = firstName + ' ' + lastName;
            const phoneNumber = phone;

            const path = join(__dirname, '../id-file-db')

            try {
                const updatedContent = `\n\nКлиент: ${fullName},\nНомер телефона: ${phoneNumber},\nСсылка на заказ: ${url}`; // Добавляем символ новой строки перед содержимым
                appendFile(path, updatedContent, { encoding: 'utf8' }); // Передаем кодировку utf8
                console.log('Файл успешно записан!');

        } catch (err) {
            console.error(err);
        }
    }
}