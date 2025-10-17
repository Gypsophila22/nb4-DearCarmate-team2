/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `ContractDocuments` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."DocStatus" AS ENUM ('TEMP', 'LINKED');

-- DropForeignKey
ALTER TABLE "public"."ContractDocuments" DROP CONSTRAINT "ContractDocuments_contractId_fkey";

-- DropIndex
DROP INDEX "public"."ContractDocuments_uploaderId_idx";

-- AlterTable
ALTER TABLE "public"."ContractDocuments" DROP COLUMN "updatedAt",
ADD COLUMN     "status" "public"."DocStatus" NOT NULL DEFAULT 'TEMP',
ALTER COLUMN "contractId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."ContractDocuments" ADD CONSTRAINT "ContractDocuments_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."Contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
