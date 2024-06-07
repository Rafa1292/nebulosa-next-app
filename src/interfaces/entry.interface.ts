import { AccountHistory } from "./account-history.interface";


export interface Entry {
    id: string;
    workDayId: string;
    description: string;
    accountHistoryId: string;
    accountHistory?: AccountHistory
}
