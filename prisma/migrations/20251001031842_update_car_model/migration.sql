/*
  Warnings:

  - You are about to drop the column `contractId` on the `Cars` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `Contracts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[custmorId]` on the table `Contracts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `custmorId` to the `Contracts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Contracts" DROP CONSTRAINT "Contracts_customerId_fkey";

-- DropIndex
DROP INDEX "public"."Contracts_customerId_key";

-- AlterTable
CREATE SEQUENCE "public".cars_id_seq;
ALTER TABLE "public"."Cars" DROP COLUMN "contractId",
ALTER COLUMN "id" SET DEFAULT nextval('"public".cars_id_seq');
ALTER SEQUENCE "public".cars_id_seq OWNED BY "public"."Cars"."id";

-- AlterTable
ALTER TABLE "public"."Contracts" DROP COLUMN "customerId",
ADD COLUMN     "custmorId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Contracts_custmorId_key" ON "public"."Contracts"("custmorId");

-- AddForeignKey
ALTER TABLE "public"."Contracts" ADD CONSTRAINT "Contracts_custmorId_fkey" FOREIGN KEY ("custmorId") REFERENCES "public"."Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
