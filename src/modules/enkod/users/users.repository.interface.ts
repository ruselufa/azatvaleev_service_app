import { PurchaseModel } from '@prisma/client';
import { Purchase } from './purchases.entity';

export interface IPurchaseRepository {
	create: (purchase: Purchase) => Promise<PurchaseModel>;
	find: (email: string) => Promise<PurchaseModel | null>;
}