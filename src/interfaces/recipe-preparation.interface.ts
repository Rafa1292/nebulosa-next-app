import { Preparation } from ".";

export interface RecipePreparation {
    id: string;
    recipeId: string;
    preparationId: string;
    quantity: number;
    measureSlug: string;
    preparation?: Preparation;
}
