
export interface Budget {
    id: string;
    goal: number;
    upperGoal: number;
    lowerGoal: number;
    month: number;
    year: number;
    fixedExpense: number;
    inventoryPercentage: number;
    expectedProfit: number;
}