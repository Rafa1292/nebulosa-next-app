-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
