import { SaleItem } from ".";

export interface SaleItemCategory {
    id: string;
    name: string;
    items?: SaleItem[];
}