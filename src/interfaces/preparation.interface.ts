import { PreparationInput } from ".";

export interface Preparation {
    id: string;
    name: string;
    cost: number;
    presentation: number;
    measureSlug: string;
    preparationInputs?: PreparationInput[];
}