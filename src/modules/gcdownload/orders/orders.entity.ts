export class Order {
	constructor(
		private readonly _idSystemGc: number,
		private readonly _idAzatGc: number,
		private readonly _idUserGc: number,
		private readonly _userName: string,
		private readonly _userEmail: string,
		private readonly _userPhone: string,
		private readonly _createdAt: string,
		private readonly _payedAt: string,
		private readonly _orderName: string,
		private readonly _dealStatus: string,
		private readonly _price: number,
		private readonly _payedPrice: number,
		private readonly _payFee: number,
		private readonly _income: number,
		private readonly _taxes: number,
		private readonly _profit: number,
		private readonly _otherFee: number,
		private readonly _netProfit: number,
		private readonly _managerName: string,
		private readonly _city: string,
		private readonly _payedBy: string,
		private readonly _promocodeUsed: string,
		private readonly _promoCompany: string,
		private readonly _utmSource: string,
		private readonly _utmMedium: string,
		private readonly _utmCampaign: string,
		private readonly _utmContent: string,
		private readonly _utmTerm: string,
		private readonly _utmGroup: string,
		private readonly _workWithOrder: string,
		private readonly _orderComments: string,
		private readonly _rejectReason: string,
		private readonly _orderTag: string,
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
	get userName(): string {
		return this._userName;
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
	get price(): number {
		return this._price;
	}
	get payedPrice(): number {
		return this._payedPrice;
	}
	get payFee(): number {
		return this._payFee;
	}
	get income(): number {
		return this._income;
	}
	get taxes(): number {
		return this._taxes;
	}
	get profit(): number {
		return this._profit;
	}
	get otherFee(): number {
		return this._otherFee;
	}
	get netProfit(): number {
		return this._netProfit;
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
	get promocodeUsed(): string {
		return this._promocodeUsed;
	}
	get promoCompany(): string {
		return this._promoCompany;
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
	get workWithOrder(): string {
		return this._workWithOrder;
	}
	get orderComments(): string {
		return this._orderComments;
	}
	get rejectReason(): string {
		return this._rejectReason;
	}
	get orderTag(): string {
		return this._orderTag;
	}
}
