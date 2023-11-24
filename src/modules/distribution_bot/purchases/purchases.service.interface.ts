import { PurchaseModel, PurchaseModelAlina2Cake } from '@prisma/client';
import { PurchaseCreateDto } from './dto/purchase-create.dto';

export interface IPurchasesService {
	createUser: (purchase: PurchaseCreateDto) => Promise<PurchaseModel | null>;
	createUserAlina2Cake: (purchase: PurchaseCreateDto) => Promise<PurchaseModelAlina2Cake | null>;
}
