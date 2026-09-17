import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
export declare class BillsController {
    private readonly billsService;
    constructor(billsService: BillsService);
    getAll(user: {
        sub: string;
    }): Promise<any[]>;
    create(user: {
        sub: string;
    }, dto: CreateBillDto): Promise<any>;
    deleteBill(user: {
        sub: string;
    }, id: string): Promise<{
        success: boolean;
    }>;
}
