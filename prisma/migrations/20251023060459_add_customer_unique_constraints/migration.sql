/*
  Warnings:

  - A unique constraint covering the columns `[companyId,name,phoneNumber]` on the table `Customers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[companyId,email]` on the table `Customers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Customers_companyId_name_phoneNumber_key" ON "Customers"("companyId", "name", "phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Customers_companyId_email_key" ON "Customers"("companyId", "email");
