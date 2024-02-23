import { ModifierGroup } from ".";

export interface ArticleModifierGroup {
    id: string;
    articleId: string;
    modifierGroupId: string;
    order: number;
    price: number;
    minSelec: number;
    maxSelec: number;
    priceByGroup: boolean;
    modifierGroup: ModifierGroup;
}