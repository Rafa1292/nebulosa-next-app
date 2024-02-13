import { Input } from ".";

export  interface PreparationInput {
    id: string;
    preparationId: string;
    inputId: string;
    quantity: number;
    measureSlug: string;
    input?: Input;
}