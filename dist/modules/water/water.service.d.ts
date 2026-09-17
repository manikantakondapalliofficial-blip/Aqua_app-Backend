import { CreateWaterDto } from './dto/create-water.dto';
export declare class WaterService {
    findByTank(tankId: string): Promise<any[]>;
    create(dto: CreateWaterDto): Promise<any>;
}
