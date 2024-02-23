import { IsString } from 'class-validator';

export class SaleCreateDto {
	@IsString({ message: 'Invalid ID' })
	id: string;

	fullname: string;

	@IsString({ message: 'Invalid Phone' })
	phone: string;
}
