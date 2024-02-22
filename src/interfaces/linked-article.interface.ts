import { LinkedArticleModifier } from ".";


export interface LinkedArticle {
    id: string;
    articleId: string;
    unitPrice: number;
    billArticleId: string;
    isComanded: boolean;
    name: string;
    modifiers: LinkedArticleModifier[]
}