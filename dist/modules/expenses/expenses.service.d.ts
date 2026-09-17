import { CreateExpenseDto } from './dto/create-expense.dto';
export declare class ExpensesService {
    findAllByUser(userId: string): Promise<any[]>;
    create(userId: string, dto: CreateExpenseDto): Promise<any>;
    updateStatus(userId: string, expenseId: string, status: string): Promise<any>;
    delete(userId: string, expenseId: string): Promise<{
        success: boolean;
    }>;
}
