/*
  Warnings:

  - A unique constraint covering the columns `[carNumber]` on the table `Cars` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Contracts" DROP CONSTRAINT "Contracts_carId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Cars_carNumber_key" ON "public"."Cars"("carNumber");

-- AddForeignKey
ALTER TABLE "public"."Contracts" ADD CONSTRAINT "Contracts_carId_fkey" FOREIGN KEY ("carId") REFERENCES "public"."Cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;
