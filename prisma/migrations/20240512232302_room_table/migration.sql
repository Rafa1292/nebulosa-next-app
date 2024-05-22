-- CreateTable
CREATE TABLE "RoomTable" (
    "id" TEXT NOT NULL,
    "posX" INTEGER NOT NULL,
    "posY" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "inUse" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RoomTable_pkey" PRIMARY KEY ("id")
);
