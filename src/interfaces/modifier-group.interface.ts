import { ModifierElement } from ".";

export interface ModifierGroup {
    id: string;
    name: string;
    showLabel: boolean;
    elements: ModifierElement[];
}