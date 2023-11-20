import { PurchaseModel } from '@prisma/client';
import { PurchaseModelAlina2Cake } from '@prisma/client';
import { Purchase } from './purchases.entity';

export interface IPurchaseRepository {
	create: (purchase: Purchase) => Promise<PurchaseModel>;
	find: (email: string) => Promise<PurchaseModel | null>;
	updateFinishAt: (
		id: number,
		startAt: string,
		finishAt: string,
		purchase_ink: string,
		state: string,
	) => Promise<PurchaseModel>;

	createAlina2Cake: (purchase: Purchase) => Promise<PurchaseModelAlina2Cake>;
	findAlina2Cake: (email: string) => Promise<PurchaseModelAlina2Cake | null>;
	updateFinishAtAlina2Cake: (
		id: number,
		startAt: string,
		finishAt: string,
		purchase_ink: string,
		state: string,
	) => Promise<PurchaseModelAlina2Cake>;
}
