-- CreateEnum
CREATE TYPE "DeliveryMethod" AS ENUM ('Mesa', 'Domicilio', 'Recoger');

-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "commissionPercentage" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemPrice" (
    "id" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "menuId" TEXT NOT NULL,
    "saleItemId" TEXT NOT NULL,

    CONSTRAINT "ItemPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElementPrice" (
    "id" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "modifierElementId" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,

    CONSTRAINT "ElementPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleModifierGroup" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "modifierGroupId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "minSelect" INTEGER NOT NULL,
    "maxSelect" INTEGER NOT NULL,
    "priceByGroup" BOOLEAN NOT NULL,

    CONSTRAINT "ArticleModifierGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModifierGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "showLabel" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ModifierGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModifierElement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "defaultRecipeId" TEXT NOT NULL,
    "combinable" BOOLEAN NOT NULL,
    "combinableModifierGroupId" TEXT NOT NULL,
    "modifierGroupId" TEXT NOT NULL,

    CONSTRAINT "ModifierElement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bill" (
    "id" TEXT NOT NULL,
    "closed" BOOLEAN NOT NULL DEFAULT false,
    "tableNumber" INTEGER NOT NULL,
    "deliveryMethod" "DeliveryMethod" NOT NULL,
    "clientId" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,
    "openWorkDayId" TEXT NOT NULL,
    "closeWorkDayId" TEXT NOT NULL,
    "commandTime" TIMESTAMP(3) NOT NULL,
    "isNull" BOOLEAN NOT NULL DEFAULT false,
    "menuId" TEXT NOT NULL,
    "isServed" BOOLEAN NOT NULL DEFAULT false,
    "isCredit" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillItem" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL,
    "tax" INTEGER NOT NULL,
    "billId" TEXT NOT NULL,
    "saleItemId" TEXT NOT NULL,
    "kitchenMessage" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BillItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillItemLinkedArticle" (
    "id" TEXT NOT NULL,
    "billItemId" TEXT NOT NULL,
    "itemNumber" INTEGER NOT NULL,
    "saleItemArticleId" TEXT NOT NULL,
    "combined" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,

    CONSTRAINT "BillItemLinkedArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkedArticle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "isCommanded" BOOLEAN NOT NULL DEFAULT false,
    "articleId" TEXT NOT NULL,
    "billArticleId" TEXT NOT NULL,

    CONSTRAINT "LinkedArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkedArticleModifier" (
    "id" TEXT NOT NULL,
    "linkedArticleId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "maxSelect" INTEGER NOT NULL,
    "minSelect" INTEGER NOT NULL,
    "showLabel" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "modifierGroupId" TEXT NOT NULL,

    CONSTRAINT "LinkedArticleModifier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkedArticleModifierElement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "linkedArticleModifierId" TEXT NOT NULL,
    "modifierElementId" TEXT NOT NULL,

    CONSTRAINT "LinkedArticleModifierElement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ItemPrice" ADD CONSTRAINT "ItemPrice_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPrice" ADD CONSTRAINT "ItemPrice_saleItemId_fkey" FOREIGN KEY ("saleItemId") REFERENCES "SaleItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElementPrice" ADD CONSTRAINT "ElementPrice_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElementPrice" ADD CONSTRAINT "ElementPrice_modifierElementId_fkey" FOREIGN KEY ("modifierElementId") REFERENCES "ModifierElement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleModifierGroup" ADD CONSTRAINT "ArticleModifierGroup_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleModifierGroup" ADD CONSTRAINT "ArticleModifierGroup_modifierGroupId_fkey" FOREIGN KEY ("modifierGroupId") REFERENCES "ModifierGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModifierElement" ADD CONSTRAINT "ModifierElement_modifierGroupId_fkey" FOREIGN KEY ("modifierGroupId") REFERENCES "ModifierGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillItem" ADD CONSTRAINT "BillItem_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillItemLinkedArticle" ADD CONSTRAINT "BillItemLinkedArticle_billItemId_fkey" FOREIGN KEY ("billItemId") REFERENCES "BillItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkedArticle" ADD CONSTRAINT "LinkedArticle_billArticleId_fkey" FOREIGN KEY ("billArticleId") REFERENCES "BillItemLinkedArticle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkedArticleModifier" ADD CONSTRAINT "LinkedArticleModifier_linkedArticleId_fkey" FOREIGN KEY ("linkedArticleId") REFERENCES "LinkedArticle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkedArticleModifierElement" ADD CONSTRAINT "LinkedArticleModifierElement_linkedArticleModifierId_fkey" FOREIGN KEY ("linkedArticleModifierId") REFERENCES "LinkedArticleModifier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
