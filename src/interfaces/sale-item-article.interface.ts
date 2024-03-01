import { Article, SaleItem } from ".";

export interface SaleItemArticle {
    id: string;
    saleItemId: string;
    articleId: string;
    quantity: number;
    saleItem?: SaleItem;
    article?: Article;
}