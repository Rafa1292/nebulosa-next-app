/*
  Warnings:

  - Added the required column `measureSlug` to the `Preparation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Preparation" ADD COLUMN     "measureSlug" TEXT NOT NULL;
