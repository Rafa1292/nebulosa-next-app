
export interface Article {
    id: string;
    name: string;
    description?: string;
    needsCommand: boolean;
    active: boolean;
    recipeId: string;
}