export declare enum HarvestType {
    Partial = "partial",
    Full = "full"
}
export declare class CreateHarvestDto {
    tank_id: string;
    harvest_qty: number;
    count_per_kg: number;
    price_per_kg: number;
    total_revenue: number;
    buyer_name?: string;
    harvest_type: HarvestType;
    harvest_date: string;
    notes?: string;
}
