export class ExportId {
	constructor(
		private readonly _name: string,
		private readonly _gcId: number,
		private readonly _status: string,
		private readonly _createdDate: Date,
		private readonly _finishedDate: Date,
	) {}
	get name(): string {
		return this._name;
	}
	get gcId(): number {
		return this._gcId;
	}
	get status(): string {
		return this._status;
	}
	get createdDate(): Date {
		return this._createdDate;
	}
	get finishedDate(): Date {
		return this._finishedDate;
	}
}
