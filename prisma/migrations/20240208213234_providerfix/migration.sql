/*
  Warnings:

  - Made the column `fixedExpense` on table `Provider` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Provider" ALTER COLUMN "fixedExpense" SET NOT NULL;
