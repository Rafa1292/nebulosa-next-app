// id String @id @default(uuid())
// accountHistoryId String @unique
// expenseId String 


export interface ExpenseAccountHistory {
    id: string;
    accountHistoryId: string;
    expenseId: string;
}
