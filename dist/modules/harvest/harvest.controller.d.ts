import { HarvestService } from './harvest.service';
import { CreateHarvestDto } from './dto/create-harvest.dto';
export declare class HarvestController {
    private readonly harvestService;
    constructor(harvestService: HarvestService);
    getAll(user: {
        sub: string;
    }): Promise<any[]>;
    create(user: {
        sub: string;
    }, dto: CreateHarvestDto): Promise<any>;
    updateStatus(user: {
        sub: string;
    }, id: string, status: string): Promise<any>;
}
