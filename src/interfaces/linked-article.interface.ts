import { LinkedArticleModifier } from ".";


export interface LinkedArticle {
    id: string;
    name: string;
    unitPrice: number;
    isCommanded: boolean;
    articleId: string;
    billArticleId: string;
    modifiers?: LinkedArticleModifier[]
    needsCommand?: boolean;
}