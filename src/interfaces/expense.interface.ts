import { ExpenseAccountHistory } from "./expense-account-history.interface";


export interface Expense {
    id: string;
    amount: number;
    isNull: boolean;
    description: string;
    providerId: string;
    workDayId: string;
    pendingPay: boolean;
    expenseAccountHistories?: ExpenseAccountHistory[];
}
