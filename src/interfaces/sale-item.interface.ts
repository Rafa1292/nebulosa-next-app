import { SaleItemArticle } from ".";

export interface SaleItem {
    id: string;
    name: string;
    saleItemCategoryId: string
    price: number;
    saleItemArticles?: SaleItemArticle[]
    }
    