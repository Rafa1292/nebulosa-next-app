-- CreateTable
CREATE TABLE "AccountHistory" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "previousBalance" INTEGER NOT NULL,
    "currentBalance" INTEGER NOT NULL,
    "pay" BOOLEAN NOT NULL,
    "payMethodId" TEXT NOT NULL,

    CONSTRAINT "AccountHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillAccountHistory" (
    "id" TEXT NOT NULL,
    "billId" TEXT NOT NULL,
    "accountHistoryId" TEXT NOT NULL,

    CONSTRAINT "BillAccountHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AccountHistory" ADD CONSTRAINT "AccountHistory_payMethodId_fkey" FOREIGN KEY ("payMethodId") REFERENCES "PayMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillAccountHistory" ADD CONSTRAINT "BillAccountHistory_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillAccountHistory" ADD CONSTRAINT "BillAccountHistory_accountHistoryId_fkey" FOREIGN KEY ("accountHistoryId") REFERENCES "AccountHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
