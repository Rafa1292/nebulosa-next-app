import { Recipe } from ".";

export interface Article {
    id: string;
    name: string;
    description: string | null;
    needsCommand: boolean;
    active: boolean;
    recipe: Recipe
}