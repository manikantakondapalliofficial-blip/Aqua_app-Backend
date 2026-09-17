export declare enum InventoryItemType {
    Feed = "feed",
    Medicine = "medicine"
}
export declare class CreateInventoryDto {
    item_name: string;
    type: InventoryItemType;
    purchase_qty: number;
    unit: string;
    price_per_unit: number;
    total_cost: number;
    supplier?: string;
    purchase_date: string;
    notes?: string;
}
