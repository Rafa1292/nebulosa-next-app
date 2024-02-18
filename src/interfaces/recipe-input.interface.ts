import { Input } from ".";

export interface RecipeInput {
    id: string;
    recipeId: string;
    inputId: string;
    quantity: number;
    measureSlug: string;
    input?: Input
}