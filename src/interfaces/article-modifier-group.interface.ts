import { ArticleModifierPrice, ModifierGroup } from ".";

export interface ArticleModifierGroup {
    id: string;
    articleId: string;
    modifierGroupId: string;
    order: number;
    minSelect: number;
    maxSelect: number;
    priceByGroup: boolean;
    modifierGroup?: ModifierGroup;
    prices?: ArticleModifierPrice[]
}