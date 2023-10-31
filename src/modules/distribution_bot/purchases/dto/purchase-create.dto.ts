import { IsInt, IsString, NotEquals } from 'class-validator';

export class PurchaseCreateDto {
	@NotEquals('undefined', { message: 'Пустое значение' })
	@IsInt({ message: 'Невалидное число' })
	gcPurchaseId: number;
	@NotEquals('undefined', { message: 'Пустое значение' })
	@IsString({ message: 'Невалидная строка' })
	email: string;
	@NotEquals('undefined', { message: 'Пустое значение' })
	@IsString({ message: 'Невалидная строка' })
	name: string;
	@NotEquals('undefined', { message: 'Пустое значение' })
	@IsInt({ message: 'Невалидное число' })
	gcUserId: number;
	@NotEquals('undefined', { message: 'Пустое значение' })
	@IsString({ message: 'Невалидная строка' })
	productTitle: string;
	@IsString({ message: 'Невалидная строка' })
	startAt: string;
	@IsString({ message: 'Невалидная строка' })
	finishAt: string;
	@IsString({ message: 'Невалидная строка' })
	period: string;
	@NotEquals('undefined', { message: 'Пустое значение' })
	@IsString({ message: 'Невалидная строка' })
	state: string;
	@NotEquals('undefined', { message: 'Пустое значение' })
	@IsString({ message: 'Невалидная строка' })
	purchase_ink: string;
}
