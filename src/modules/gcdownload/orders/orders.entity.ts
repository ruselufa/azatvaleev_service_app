export class Order {
	constructor(
		private readonly _idSystemGc: number,
		private readonly _idAzatGc: number,
		private readonly _idUserGc: number,
		private readonly _user_id: number,
		private readonly _userEmail: string,
		private readonly _userPhone: string,
		private readonly _createdAt: string,
		private readonly _payedAt: string,
		private readonly _orderName: string,
		private readonly _dealStatus: string,
		private readonly _price: string,
		private readonly _payedPrice: string,
		private readonly _payFee: string,
		private readonly _income: string,
		private readonly _taxes: string,
		private readonly _profit: string,
		private readonly _otherFee: string,
		private readonly _netProfit: string,
		private readonly _currency: string,
		private readonly _managerName: string,
		private readonly _city: string,
		private readonly _payedBy: string,
		private readonly _partnerId: string,
		private readonly _promocodeUsed: string,
		private readonly _promoCompany: string,
		private readonly _customUtmSource: string,
		private readonly _customUtmMedium: string,
		private readonly _customUtmCampaign: string,
		private readonly _customUtmContent: string,
		private readonly _customUtmTerm: string,
		private readonly _utmSource: string,
		private readonly _utmMedium: string,
		private readonly _utmCampaign: string,
		private readonly _utmContent: string,
		private readonly _utmTerm: string,
		private readonly _utmGroup: string,
		private readonly _managerTag: string,
		private readonly _offerTag: string,
	) {}
	get idSystemGc(): number {
		return this._idSystemGc;
	}
	get idAzatGc(): number {
		return this._idAzatGc;
	}
	get idUserGc(): number {
		return this._idUserGc;
	}
	get user_id(): number {
		return this._user_id;
	}
	get userEmail(): string {
		return this._userEmail;
	}
	get userPhone(): string {
		return this._userPhone;
	}
	get createdAt(): string {
		return this._createdAt;
	}
	get payedAt(): string {
		return this._payedAt;
	}
	get orderName(): string {
		return this._orderName;
	}
	get dealStatus(): string {
		return this._dealStatus;
	}
	get price(): string {
		return this._price;
	}
	get payedPrice(): string {
		return this._payedPrice;
	}
	get payFee(): string {
		return this._payFee;
	}
	get income(): string {
		return this._income;
	}
	get taxes(): string {
		return this._taxes;
	}
	get profit(): string {
		return this._profit;
	}
	get otherFee(): string {
		return this._otherFee;
	}
	get netProfit(): string {
		return this._netProfit;
	}
	get currency(): string {
		return this._currency;
	}
	get managerName(): string {
		return this._managerName;
	}
	get city(): string {
		return this._city;
	}
	get payedBy(): string {
		return this._payedBy;
	}
	get partnerId(): string {
		return this._partnerId;
	}
	get promocodeUsed(): string {
		return this._promocodeUsed;
	}
	get promoCompany(): string {
		return this._promoCompany;
	}
	get customUtmSource(): string {
		return this._customUtmSource;
	}
	get customUtmMedium(): string {
		return this._customUtmMedium;
	}
	get customUtmCampaign(): string {
		return this._customUtmCampaign;
	}
	get customUtmContent(): string {
		return this._customUtmContent;
	}
	get customUtmTerm(): string {
		return this._customUtmTerm;
	}
	get utmSource(): string {
		return this._utmSource;
	}
	get utmMedium(): string {
		return this._utmMedium;
	}
	get utmCampaign(): string {
		return this._utmCampaign;
	}
	get utmContent(): string {
		return this._utmContent;
	}
	get utmTerm(): string {
		return this._utmTerm;
	}
	get utmGroup(): string {
		return this._utmGroup;
	}
	get managerTag(): string {
		return this._managerTag;
	}
	get offerTag(): string {
		return this._offerTag;
	}
}