import { LinkedArticle } from ".";

export interface BillItemLinkedArticle {
    id: string;
    billItemId: string;
    itemNumber: number;
    saleItemArticleId: string;
    combined: boolean;
    description: string;
    linkedArticles?: LinkedArticle[]
}