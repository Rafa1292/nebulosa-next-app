/*
  Warnings:

  - Made the column `needsCommand` on table `Article` required. This step will fail if there are existing NULL values in that column.
  - Made the column `active` on table `Article` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "needsCommand" SET NOT NULL,
ALTER COLUMN "active" SET NOT NULL;
