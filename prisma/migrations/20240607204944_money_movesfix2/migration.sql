-- AddForeignKey
ALTER TABLE "ExpenseAccountHistory" ADD CONSTRAINT "ExpenseAccountHistory_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseAccountHistory" ADD CONSTRAINT "ExpenseAccountHistory_accountHistoryId_fkey" FOREIGN KEY ("accountHistoryId") REFERENCES "AccountHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
