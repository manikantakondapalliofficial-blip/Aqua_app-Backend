import { CreateTankDto } from './dto/create-tank.dto';
import { UpdateTankDto } from './dto/update-tank.dto';
export declare class TanksService {
    findAllByUser(userId: string): Promise<any[]>;
    create(userId: string, dto: CreateTankDto): Promise<any>;
    update(id: string, dto: UpdateTankDto): Promise<any>;
}
