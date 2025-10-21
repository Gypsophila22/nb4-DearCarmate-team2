/*
 Warnings:
 
 - You are about to drop the column `alarms` on the `Contracts` table. All the data in the column will be lost.
 - Added the required column `contractPrice` to the `Contracts` table without a default value. This is not possible if the table is not empty.
 - Added the required column `resolutionDate` to the `Contracts` table without a default value. This is not possible if the table is not empty.
 - Added the required column `status` to the `Contracts` table without a default value. This is not possible if the table is not empty.
 - Added the required column `userId` to the `Contracts` table without a default value. This is not possible if the table is not empty.
 
 */
-- CreateEnum
CREATE TYPE "public"."ContractsStatus" AS ENUM (
    'carInspection',
    'priceNegotiation',
    'contractDraft',
    'contractSuccessful',
    'contractFailed'
);
-- AlterTable
ALTER TABLE "public"."Contracts" DROP COLUMN "alarms",
    ADD COLUMN "contractPrice" INTEGER NOT NULL,
    ADD COLUMN "resolutionDate" TIMESTAMP(3),
    ADD COLUMN "status" "public"."ContractsStatus" NOT NULL,
    ADD COLUMN "userId" INTEGER NOT NULL,
    ALTER COLUMN "date"
SET DEFAULT CURRENT_TIMESTAMP;
-- CreateTable
CREATE TABLE "public"."Meetings" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "contractId" INTEGER NOT NULL,
    CONSTRAINT "Meetings_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."Alarms" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "meetingId" INTEGER NOT NULL,
    CONSTRAINT "Alarms_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."ContractDocuments" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "contractId" INTEGER,
    "uploaderId" INTEGER NOT NULL,
    "originalName" TEXT NOT NULL,
    "storedName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "path" TEXT,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContractDocuments_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE INDEX "ContractDocuments_companyId_idx" ON "public"."ContractDocuments"("companyId");
-- CreateIndex
CREATE INDEX "ContractDocuments_contractId_idx" ON "public"."ContractDocuments"("contractId");
-- AddForeignKey
ALTER TABLE "public"."Contracts"
ADD CONSTRAINT "Contracts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."Meetings"
ADD CONSTRAINT "Meetings_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."Contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."Alarms"
ADD CONSTRAINT "Alarms_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "public"."Meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."ContractDocuments"
ADD CONSTRAINT "ContractDocuments_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."ContractDocuments"
ADD CONSTRAINT "ContractDocuments_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."Contracts"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."ContractDocuments"
ADD CONSTRAINT "ContractDocuments_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;