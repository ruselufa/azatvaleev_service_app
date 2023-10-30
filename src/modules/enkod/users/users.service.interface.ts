import { PurchaseModel } from '@prisma/client';
import { PurchaseCreateDto } from './dto/purchase-create.dto';

export interface IPurchasesService {
	createUser: (purchase: PurchaseCreateDto) => Promise<PurchaseModel | null>;
}
