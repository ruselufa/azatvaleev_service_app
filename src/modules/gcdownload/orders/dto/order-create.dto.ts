import { IsInt, IsString, NotEquals } from 'class-validator';

export class OrderCreateDto {
	@NotEquals('undefined', { message: 'Пустое значение' })
	@IsInt({ message: 'Невалидное число' })
	idSystemGc: number;

	@NotEquals('undefined', { message: 'Пустое значение' })
	@IsInt({ message: 'Невалидное число' })
	idAzatGc: number;

	@NotEquals('undefined', { message: 'Пустое значение' })
	@IsInt({ message: 'Невалидное число' })
	idUserGc: number;

	@NotEquals('undefined', { message: 'Пустое значение' })
	@IsInt({ message: 'Невалидное число' })
	user_id: number;

	@IsString({ message: 'Невалидная строка' })
	userEmail: string;

	@IsString({ message: 'Невалидная строка' })
	userPhone: string;

	@IsString({ message: 'Невалидная строка' })
	createdAt: string;

	@IsString({ message: 'Невалидная строка' })
	payedAt: string;

	@IsString({ message: 'Невалидная строка' })
	orderName: string;

	@IsString({ message: 'Невалидная строка' })
	dealStatus: string;

	@IsString({ message: 'Невалидная строка' })
	price: string;

	@IsString({ message: 'Невалидная строка' })
	payedPrice: string;

	@IsString({ message: 'Невалидная строка' })
	payFee: string;

	@IsString({ message: 'Невалидная строка' })
	income: string;

	@IsString({ message: 'Невалидная строка' })
	taxes: string;

	@IsString({ message: 'Невалидная строка' })
	profit: string;

	@IsString({ message: 'Невалидная строка' })
	otherFee: string;

	@IsString({ message: 'Невалидная строка' })
	netProfit: string;

	@IsString({ message: 'Невалидная строка' })
	currency: string;

	@IsString({ message: 'Невалидная строка' })
	managerName: string;

	@IsString({ message: 'Невалидная строка' })
	city: string;

	@IsString({ message: 'Невалидная строка' })
	payedBy: string;

	@IsString({ message: 'Невалидная строка' })
	partnerId: string;

	@IsString({ message: 'Невалидная строка' })
	promocodeUsed: string;

	@IsString({ message: 'Невалидная строка' })
	promoCompany: string;

	@IsString({ message: 'Невалидная строка' })
	customUtmSource: string;

	@IsString({ message: 'Невалидная строка' })
	customUtmMedium: string;

	@IsString({ message: 'Невалидная строка' })
	customUtmCampaign: string;

	@IsString({ message: 'Невалидная строка' })
	customUtmContent: string;

	@IsString({ message: 'Невалидная строка' })
	customUtmTerm: string;

	@IsString({ message: 'Невалидная строка' })
	utmSource: string;

	@IsString({ message: 'Невалидная строка' })
	utmMedium: string;

	@IsString({ message: 'Невалидная строка' })
	utmCampaign: string;

	@IsString({ message: 'Невалидная строка' })
	utmContent: string;

	@IsString({ message: 'Невалидная строка' })
	utmTerm: string;

	@IsString({ message: 'Невалидная строка' })
	utmGroup: string;

	@IsString({ message: 'Невалидная строка' })
	managerTag: string;

	@IsString({ message: 'Невалидная строка' })
	offerTag: string;
}
