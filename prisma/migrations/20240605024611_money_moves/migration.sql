-- CreateTable
CREATE TABLE "Entry" (
    "id" TEXT NOT NULL,
    "workDayId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "accountHistoryId" TEXT NOT NULL,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "isNull" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "workDayId" TEXT NOT NULL,
    "pendingPay" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpenseAccountHistory" (
    "id" TEXT NOT NULL,
    "accountHistoryId" TEXT NOT NULL,
    "expenseId" TEXT NOT NULL,

    CONSTRAINT "ExpenseAccountHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Entry_workDayId_key" ON "Entry"("workDayId");

-- CreateIndex
CREATE UNIQUE INDEX "Entry_accountHistoryId_key" ON "Entry"("accountHistoryId");

-- CreateIndex
CREATE UNIQUE INDEX "ExpenseAccountHistory_accountHistoryId_key" ON "ExpenseAccountHistory"("accountHistoryId");

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_accountHistoryId_fkey" FOREIGN KEY ("accountHistoryId") REFERENCES "AccountHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
