import { ModifierGroup } from ".";

export interface ArticleModifierGroup {
    id: string;
    articleId: string;
    modifierGroupId: string;
    order: number;
    price: number;
    minSelect: number;
    maxSelect: number;
    priceByGroup: boolean;
    modifierGroup?: ModifierGroup;
}