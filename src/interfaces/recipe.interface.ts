import { RecipeInput } from ".";
import { RecipePreparation } from "./recipe-preparation.interface";

export interface Recipe {
    id: string;
    name: string;
    cost: number;
    recipePreparations: RecipePreparation[];
    recipeInputs: RecipeInput[];
}