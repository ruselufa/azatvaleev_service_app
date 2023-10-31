import { Equals, IsEmpty, IsInt, IsString, NotEquals } from 'class-validator';

export class UserCreateDto {
	@NotEquals('undefined', { message: 'Пустое значение' })
	@IsInt({ message: 'Невалидное число' })
	gcUserId: number;

	@NotEquals('undefined', { message: 'Пустое значение' })
	@IsString({ message: 'Невалидная строка' })
	email: string;

	@IsString({ message: 'Невалидная строка' })
	firstName: string;

	@IsString({ message: 'Невалидная строка' })
	lastName: string;

	@NotEquals('undefined', { message: 'Пустое значение' })
	@IsInt({ message: 'Невалидное число' })
	gcOrderId: number;

	@IsString({ message: 'Невалидная строка' })
	positionsInOrder: string;

	@NotEquals('undefined', { message: 'Пустое значение' })
	@IsString({ message: 'Невалидная строка' })
	createdAtOrder: string;

	@NotEquals('undefined', { message: 'Пустое значение' })
	@IsString({ message: 'Невалидная строка' })
	statusOrder: string;
}
