import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    getAll(user: {
        sub: string;
    }): Promise<any[]>;
    create(user: {
        sub: string;
    }, dto: CreateExpenseDto): Promise<any>;
    updateStatus(user: {
        sub: string;
    }, id: string, status: string): Promise<any>;
    deleteExpense(user: {
        sub: string;
    }, id: string): Promise<{
        success: boolean;
    }>;
}
