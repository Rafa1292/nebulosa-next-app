// id String @id @default(uuid())
// accountHistoryId String @unique
// expenseId String 

import { AccountHistory } from "./account-history.interface";


export interface ExpenseAccountHistory {
    id: string;
    accountHistoryId: string;
    expenseId: string;
    accountHistory?: AccountHistory
}
