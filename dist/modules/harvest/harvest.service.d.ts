import { CreateHarvestDto } from './dto/create-harvest.dto';
export declare class HarvestService {
    findAllForUser(userId: string): Promise<any[]>;
    create(userId: string, dto: CreateHarvestDto): Promise<any>;
    updateStatus(userId: string, harvestId: string, status: string): Promise<any>;
}
