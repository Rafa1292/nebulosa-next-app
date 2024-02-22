import { LinkedArticleModifierElement } from ".";


export interface LinkedArticleModifier {
    id: string;
    linkedArticleId: string;
    quantity: number;
    maxSelectable: number;
    minSelectable: number;
    showLabel: boolean;
    name: string;
    modifierGroupId: string;
    elements: LinkedArticleModifierElement[];
}