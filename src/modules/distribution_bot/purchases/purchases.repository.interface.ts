import { PurchaseModel } from '@prisma/client';
import { PurchaseModelAlina2Cake } from '@prisma/client';
import { Purchase } from './purchases.entity';

export interface IPurchaseRepository {
	create: (purchase: Purchase) => Promise<PurchaseModel>;
	find: (gcPurchaseId: number) => Promise<PurchaseModel | null>;
	updateFinishAt: (id: number, finishAt: string, purchase_ink: string) => Promise<PurchaseModel>;

	createAlina2Cake: (purchase: Purchase) => Promise<PurchaseModelAlina2Cake>;
	findAlina2Cake: (gcPurchaseId: number) => Promise<PurchaseModelAlina2Cake | null>;
	updateFinishAtAlina2Cake: (
		id: number,
		finishAt: string,
		purchase_ink: string,
	) => Promise<PurchaseModelAlina2Cake>;
}
