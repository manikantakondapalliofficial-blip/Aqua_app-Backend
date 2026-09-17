export interface ExpenseEntity {
  id: string;
  user_id: string;
  type: 'medicine' | 'labour' | 'electricity' | 'netting' | 'investment';
  amount: number;
  date: string;
  notes?: string;
}
