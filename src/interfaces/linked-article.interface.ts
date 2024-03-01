import { LinkedArticleModifier } from ".";


export interface LinkedArticle {
    id: string;
    name: string;
    unitPrice: number;
    isComanded: boolean;
    articleId: string;
    billArticleId: string;
    modifiers?: LinkedArticleModifier[]
}