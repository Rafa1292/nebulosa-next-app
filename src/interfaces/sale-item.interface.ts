import { ItemPrice, SaleItemArticle } from ".";

export interface SaleItem {
    id: string;
    name: string;
    saleItemCategoryId: string
    saleItemArticles?: SaleItemArticle[]
    prices?: ItemPrice[]
    }
    