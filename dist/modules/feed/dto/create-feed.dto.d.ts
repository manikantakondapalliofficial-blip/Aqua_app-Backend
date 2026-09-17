declare enum TimeSlot {
    Morning = "morning",
    Afternoon = "afternoon",
    Evening = "evening",
    Night = "night"
}
export declare class CreateFeedDto {
    tank_id: string;
    feed_name: string;
    quantity: number;
    cost: number;
    time_slot: TimeSlot;
    date: string;
    inventory_id?: string;
}
export {};
