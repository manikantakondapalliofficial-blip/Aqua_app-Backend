import { WaterService } from './water.service';
import { CreateWaterDto } from './dto/create-water.dto';
export declare class WaterController {
    private readonly waterService;
    constructor(waterService: WaterService);
    getAll(tankId: string): Promise<any[]>;
    create(dto: CreateWaterDto): Promise<any>;
}
