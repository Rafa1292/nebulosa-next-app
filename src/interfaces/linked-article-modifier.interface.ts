import { LinkedArticleModifierElement } from ".";


export interface LinkedArticleModifier {
    id: string;
    linkedArticleId: string;
    quantity: number;
    maxSelect: number;
    minSelect: number;
    showLabel: boolean;
    name: string;
    modifierGroupId: string;
    elements?: LinkedArticleModifierElement[];
}