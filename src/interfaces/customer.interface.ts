import { Address } from "./address.interface";

export interface Customer {
    id: string;
    name: string;
    phone: string;
    email: string;
    idNumber: string;
    creditState: boolean;
    creditLimit: number;
    adresses?: Address[];
}