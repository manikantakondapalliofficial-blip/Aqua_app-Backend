export interface FeedEntity {
  id: string;
  tank_id: string;
  feed_name: string;
  quantity: number;
  cost: number;
  time_slot: 'morning' | 'afternoon' | 'evening' | 'night';
  date: string;
}
