/*
  Warnings:

  - You are about to drop the column `recipeId` on the `Article` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[articleId]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `articleId` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_recipeId_fkey";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "recipeId";

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "articleId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_articleId_key" ON "Recipe"("articleId");

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
