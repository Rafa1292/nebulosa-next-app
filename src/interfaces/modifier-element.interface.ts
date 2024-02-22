import { ElementPrice } from ".";


export interface ModifierElement {
    id: string;
    name: string;
    defaultRecipeId: string;
    combinable: boolean;
    combinableModifierGroupId: string;
    modifierGroupId: string;
    prices: ElementPrice[];
}