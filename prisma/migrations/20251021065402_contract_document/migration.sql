/*
  Warnings:

  - You are about to drop the column `userId` on the `ContractDocuments` table. All the data in the column will be lost.
  - Added the required column `uploaderId` to the `ContractDocuments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ContractDocuments" DROP CONSTRAINT "ContractDocuments_userId_fkey";

-- AlterTable
ALTER TABLE "ContractDocuments" DROP COLUMN "userId",
ADD COLUMN     "uploaderId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ContractDocuments" ADD CONSTRAINT "ContractDocuments_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
