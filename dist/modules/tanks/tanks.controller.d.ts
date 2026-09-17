import { TanksService } from './tanks.service';
import { CreateTankDto } from './dto/create-tank.dto';
import { UpdateTankDto } from './dto/update-tank.dto';
export declare class TanksController {
    private readonly tanksService;
    constructor(tanksService: TanksService);
    getAll(user: {
        sub: string;
    }): Promise<any[]>;
    create(user: {
        sub: string;
    }, dto: CreateTankDto): Promise<any>;
    update(id: string, dto: UpdateTankDto): Promise<any>;
}
