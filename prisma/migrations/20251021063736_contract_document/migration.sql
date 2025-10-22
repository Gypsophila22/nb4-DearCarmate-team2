/*
  Warnings:

  - You are about to drop the column `uploaderId` on the `ContractDocuments` table. All the data in the column will be lost.
  - Added the required column `userId` to the `ContractDocuments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ContractDocuments" DROP CONSTRAINT "ContractDocuments_uploaderId_fkey";

-- AlterTable
ALTER TABLE "ContractDocuments" DROP COLUMN "uploaderId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ContractDocuments" ADD CONSTRAINT "ContractDocuments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
