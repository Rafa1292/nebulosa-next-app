
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

export interface Months {
    id: number;
    name: string;
}

export const months: Months[] = [
    { id: 1, name: 'Enero' },
    { id: 2, name: 'Febrero' },
    { id: 3, name: 'Marzo' },
    { id: 4, name: 'Abril' },
    { id: 5, name: 'Mayo' },
    { id: 6, name: 'Junio' },
    { id: 7, name: 'Julio' },
    { id: 8, name: 'Agosto' },
    { id: 9, name: 'Setiembre' },
    { id: 10, name: 'Octubre' },
    { id: 11, name: 'Noviembre' },
    { id: 12, name: 'Diciembre' },
];
