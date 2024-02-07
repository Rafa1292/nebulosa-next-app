
export interface ProviderInput {
    id: string;
    providerId: string;
    inputId: string;
    lowerPrice: number;
    upperPrice: number;
    currentPrice: number;
    lastPrice: number;
    expectedPrice: number;
    presentation: number;
    measureSlug: string;
}