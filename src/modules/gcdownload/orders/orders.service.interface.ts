import { ExportModel, OrderModel } from '@prisma/client';
import { OrderCreateDto } from './dto/order-create.dto';
import { ExportIdCreateDto } from './dto/exportId-create.dto';
import { NextFunction, Request, Response } from 'express';
import { Axios, AxiosResponse } from 'axios';

export interface IOrdersService {
	createExportId: (maxRetries: number, delayMs: number) => Promise<number | null>;
	createOrder: (order: OrderCreateDto) => Promise<OrderModel | null>;
	updateOrder: (order: OrderCreateDto) => Promise<OrderModel | null>;
	requestExportId: () => Promise<AxiosResponse | undefined>;
	makeExport: (exportId: number) => Promise<AxiosResponse | undefined>;
	writeExportData: (data: AxiosResponse) => Promise<OrderModel | null>;
	findStatusExportTask: (status: string) => Promise<ExportModel[] | []>;
	updateExportId: (id: number, status: string) => Promise<ExportModel | null>;
}

export interface ApiResponse {
	// определяем интерфейс для данных, возвращаемых сервером
	data: {
		success: boolean;
		info: {};
		error_message: string;
		error: boolean;
		error_code: number;
	};
	status: number;
	statusText: string;
	headers: any;
	config: any;
}
