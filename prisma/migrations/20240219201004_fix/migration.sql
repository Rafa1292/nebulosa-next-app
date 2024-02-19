/*
  Warnings:

  - You are about to drop the column `route` on the `Provider` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Provider" DROP COLUMN "route",
ADD COLUMN     "routes" "Route"[];

-- CreateTable
CREATE TABLE "SaleItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "saleItemCategoryId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "SaleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleItemCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SaleItemCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleItemArticle" (
    "id" TEXT NOT NULL,
    "saleItemId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SaleItemArticle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SaleItem_name_key" ON "SaleItem"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SaleItemCategory_name_key" ON "SaleItemCategory"("name");

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_saleItemCategoryId_fkey" FOREIGN KEY ("saleItemCategoryId") REFERENCES "SaleItemCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItemArticle" ADD CONSTRAINT "SaleItemArticle_saleItemId_fkey" FOREIGN KEY ("saleItemId") REFERENCES "SaleItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItemArticle" ADD CONSTRAINT "SaleItemArticle_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
