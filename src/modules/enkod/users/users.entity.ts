export class User {
	constructor(
		private readonly _gcUserId: number,
		private readonly _email: string,
		private readonly _firstName: string,
		private readonly _lastName: string,
		private readonly _gcOrderId: number,
		private readonly _positionsInOrder: string,
		private readonly _createdAtOrder: string,
		private readonly _statusOrder: string,
	) {}

	get gcUserId(): number {
		return this._gcUserId;
	}

	get email(): string {
		return this._email;
	}

	get firstName(): string {
		return this._firstName;
	}

	get lastName(): string {
		return this._lastName;
	}

	get gcOrderId(): number {
		return this._gcOrderId;
	}

	get positionsInOrder(): string {
		return this._positionsInOrder;
	}

	get createdAtOrder(): string {
		return this._createdAtOrder;
	}

	get statusOrder(): string {
		return this._statusOrder;
	}
}
