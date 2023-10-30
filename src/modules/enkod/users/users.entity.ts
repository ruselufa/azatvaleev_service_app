export class Purchase {
	constructor(
		private readonly _gcPurchaseId: number,
		private readonly _email: string,
		private readonly _name: string,
		private readonly _gcUserId: number,
		private readonly _productTitle: string,
		private readonly _startAt: string,
		private readonly _finishAt: string,
		private readonly _period: string,
		private readonly _state: string,
		private readonly _purchase_ink: string,
	) {}

	get gcPurchaseId(): number {
		return this._gcPurchaseId;
	}

	get email(): string {
		return this._email;
	}

	get name(): string {
		return this._name;
	}

	get gcUserId(): number {
		return this._gcUserId;
	}

	get productTitle(): string {
		return this._productTitle;
	}

	get startAt(): string {
		return this._startAt;
	}

	get finishAt(): string {
		return this._finishAt;
	}

	get period(): string {
		return this._period;
	}

	get state(): string {
		return this._state;
	}

	get purchase_ink(): string {
		return this._purchase_ink;
	}
}
