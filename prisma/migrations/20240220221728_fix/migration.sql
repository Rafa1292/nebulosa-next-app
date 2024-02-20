-- CreateTable
CREATE TABLE "Budget" (
    "id" TEXT NOT NULL,
    "goal" INTEGER NOT NULL,
    "upperGoal" INTEGER NOT NULL,
    "lowerGoal" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "fixedExpense" INTEGER NOT NULL,
    "inventoryPercentage" INTEGER NOT NULL,
    "expectedProfit" INTEGER NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkDay" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "initialCash" INTEGER NOT NULL,
    "finalCash" INTEGER NOT NULL,
    "sales" INTEGER NOT NULL,
    "expenses" INTEGER NOT NULL,
    "diference" INTEGER NOT NULL,
    "closed" BOOLEAN NOT NULL,

    CONSTRAINT "WorkDay_pkey" PRIMARY KEY ("id")
);
