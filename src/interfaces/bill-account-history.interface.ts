import { AccountHistory } from "./account-history.interface"

export interface BillAccountHistory{
    id: string
    billId: string
    accountHistoryId: string
    accountHistory?: AccountHistory
}