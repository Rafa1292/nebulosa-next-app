-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "Magnitude" AS ENUM ('Masa', 'Volumen', 'Unidad');

-- CreateEnum
CREATE TYPE "Route" AS ENUM ('L', 'K', 'M', 'J', 'V', 'S', 'D');

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "needsCommand" BOOLEAN DEFAULT false,
    "active" BOOLEAN DEFAULT true,
    "recipeId" TEXT NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InputCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "InputCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Input" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lowerPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "upperPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currentPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "expectedPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stock" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "presentation" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "suggestedStock" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currentProviderId" TEXT NOT NULL,
    "inputCategoryId" TEXT NOT NULL,
    "measureSlug" TEXT NOT NULL,

    CONSTRAINT "Input_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "route" "Route"[],
    "fixedExpense" BOOLEAN DEFAULT false,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderInput" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "inputId" TEXT NOT NULL,
    "lowerPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "upperPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currentPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "expectedPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "presentation" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "measureSlug" TEXT NOT NULL,

    CONSTRAINT "ProviderInput_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Preparation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "presentation" INTEGER NOT NULL,

    CONSTRAINT "Preparation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreparationInput" (
    "id" TEXT NOT NULL,
    "preparationId" TEXT NOT NULL,
    "inputId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "measureSlug" TEXT NOT NULL,

    CONSTRAINT "PreparationInput_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeInput" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "inputId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "measureSlug" TEXT NOT NULL,

    CONSTRAINT "RecipeInput_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipePreparation" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "preparationId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "measureSlug" TEXT NOT NULL,

    CONSTRAINT "RecipePreparation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_name_key" ON "Recipe"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "InputCategory_name_key" ON "InputCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Input_name_key" ON "Input"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_name_key" ON "Provider"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_phone_key" ON "Provider"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_email_key" ON "Provider"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Preparation_name_key" ON "Preparation"("name");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Input" ADD CONSTRAINT "Input_currentProviderId_fkey" FOREIGN KEY ("currentProviderId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Input" ADD CONSTRAINT "Input_inputCategoryId_fkey" FOREIGN KEY ("inputCategoryId") REFERENCES "InputCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderInput" ADD CONSTRAINT "ProviderInput_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderInput" ADD CONSTRAINT "ProviderInput_inputId_fkey" FOREIGN KEY ("inputId") REFERENCES "Input"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreparationInput" ADD CONSTRAINT "PreparationInput_preparationId_fkey" FOREIGN KEY ("preparationId") REFERENCES "Preparation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreparationInput" ADD CONSTRAINT "PreparationInput_inputId_fkey" FOREIGN KEY ("inputId") REFERENCES "Input"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeInput" ADD CONSTRAINT "RecipeInput_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeInput" ADD CONSTRAINT "RecipeInput_inputId_fkey" FOREIGN KEY ("inputId") REFERENCES "Input"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipePreparation" ADD CONSTRAINT "RecipePreparation_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipePreparation" ADD CONSTRAINT "RecipePreparation_preparationId_fkey" FOREIGN KEY ("preparationId") REFERENCES "Preparation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
