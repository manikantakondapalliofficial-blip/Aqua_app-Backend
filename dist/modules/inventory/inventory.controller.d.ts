import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    getAll(user: {
        sub: string;
    }): Promise<any[]>;
    create(user: {
        sub: string;
    }, dto: CreateInventoryDto): Promise<any>;
    update(id: string, dto: UpdateInventoryDto): Promise<any>;
    remove(id: string): Promise<any>;
}
