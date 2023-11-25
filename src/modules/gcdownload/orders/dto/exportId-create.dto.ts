import { IsInt, IsString, NotEquals } from 'class-validator';

export class ExportIdCreateDto {
	name: string;
	gcId: number;
	status: string;
	createdDate: Date;
	finishedDate: Date;
}
