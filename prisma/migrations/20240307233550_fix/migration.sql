-- CreateTable
CREATE TABLE "ArticleModifierPrice" (
    "id" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "articleModifierId" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,

    CONSTRAINT "ArticleModifierPrice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ArticleModifierPrice" ADD CONSTRAINT "ArticleModifierPrice_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleModifierPrice" ADD CONSTRAINT "ArticleModifierPrice_articleModifierId_fkey" FOREIGN KEY ("articleModifierId") REFERENCES "ArticleModifierGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
