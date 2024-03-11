import { SaleItem } from ".";

export interface SaleItemCategory {
    id: string;
    name: string;
    saleItems?: SaleItem[];
}