
export interface Input {
    id: string;
    name: string;
    lowerPrice: number;
    upperPrice: number;
    currentPrice: number;
    lastPrice: number;
    expectedPrice: number;
    stock: number;
    presentation: number;
    suggestedStock: number;
    currentProviderId: string;
    inputCategoryId: string;
    measureSlug: string;
}

export type Magnitude = 'Masa' | 'Volumen' | 'Unidad';

export interface Measure {
    slug: string;
    name: string;
    magnitude: Magnitude;
    abbreviation: string;
    value: number;
}

export const measures: Measure[] = [
    {
        slug:'w6p6iPcq34ReVMhbrTzhCg',
        name: 'Kilogramo',
        magnitude: 'Masa',
        abbreviation: 'Kg',
        value: 1000
    },
    {
        slug:'ack_5ii19nZWwwa9TGWMpA',
        name: 'Gramo',
        magnitude: 'Masa',
        abbreviation: 'g',
        value: 1
    },
    {
        slug:'17H_kppkDC8YFmXl0hBfFw',
        name: 'Litro',
        magnitude: 'Volumen',
        abbreviation: 'L',
        value: 1000
    },
    {
        slug:'oGtjM7nbrw0whTOiscMvtA',
        name: 'Mililitro',
        magnitude: 'Volumen',
        abbreviation: 'ml',
        value: 1
    },
    {
        slug:'8D1wIqNqqNO5xD71TvoxJQ',
        name: 'Unidad',
        magnitude: 'Unidad',
        abbreviation: 'Un',
        value: 1
    }
];