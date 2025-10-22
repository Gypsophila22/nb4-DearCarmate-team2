/*
  Warnings:

  - You are about to drop the column `status` on the `ContractDocuments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ContractDocuments" DROP COLUMN "status";

-- DropEnum
DROP TYPE "public"."DocStatus";
