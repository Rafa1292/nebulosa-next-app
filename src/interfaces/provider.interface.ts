
export type Route = 'L' | 'K'| 'M' | 'J' | 'V' | 'S' | 'D';

export interface Provider {
    id: string;
    name: string;
    phone: string;
    email: string;
    routes: Route[];
    fixedExpense: boolean;
}