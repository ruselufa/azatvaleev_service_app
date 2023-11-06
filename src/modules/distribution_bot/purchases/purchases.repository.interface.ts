import { PurchaseModel } from '@prisma/client';
import { PurchaseModelAlina2Cake } from '@prisma/client';
import { Purchase } from './purchases.entity';

export interface IPurchaseRepository {
	create: (purchase: Purchase) => Promise<PurchaseModel>;
	createAlina2Cake: (purchase: Purchase) => Promise<PurchaseModelAlina2Cake>;
	find: (email: string) => Promise<PurchaseModel | null>;
}