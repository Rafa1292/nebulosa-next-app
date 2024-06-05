import { BillAccountHistory, BillItem, Customer } from ".";



export interface Bill {
    id: string;
    closed: boolean;
    tableNumber: number;
    deliveryMethod: DeliveryMethod;
    clientId: string;
    addressId: string;
    openWorkDayId: string;
    closeWorkDayId: string;
    commandTime: Date;
    isNull: boolean;
    menuId: string;
    isServed: boolean;
    isCredit: boolean;
    items?: BillItem[];
    histories?: BillAccountHistory[];
    customer?: Customer
}

export type DeliveryMethod = 'Mesa' | 'Domicilio' | 'Recoger';