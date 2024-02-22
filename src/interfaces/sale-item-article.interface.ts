import { Article } from ".";

export interface SaleItemArticle {
    id: string;
    saleItemId: string;
    articleId: string;
    quantity: number;
    article: Article;
}