import { Recipe } from ".";

export interface Article {
    id: string;
    name: string;
    description?: string;
    needsCommand: boolean;
    active: boolean;
    Recipe: Recipe
}