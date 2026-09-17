import { CreateBillDto } from './dto/create-bill.dto';
export declare class BillsService {
    findAllByUser(userId: string): Promise<any[]>;
    create(userId: string, dto: CreateBillDto): Promise<any>;
    delete(userId: string, id: string): Promise<{
        success: boolean;
    }>;
}
