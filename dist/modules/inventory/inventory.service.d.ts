import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
export declare class InventoryService {
    findAllByUser(userId: string): Promise<any[]>;
    create(userId: string, dto: CreateInventoryDto): Promise<any>;
    update(id: string, dto: UpdateInventoryDto): Promise<any>;
    remove(id: string): Promise<any>;
}
