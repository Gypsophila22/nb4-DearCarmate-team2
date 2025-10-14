/*
 Warnings:
 
 - You are about to drop the column `alarms` on the `Contracts` table. All the data in the column will be lost.
 - You are about to drop the column `custmorId` on the `Contracts` table. All the data in the column will be lost.
 - A unique constraint covering the columns `[customerId]` on the table `Contracts` will be added. If there are existing duplicate values, this will fail.
 - Added the required column `contractPrice` to the `Contracts` table without a default value. This is not possible if the table is not empty.
 - Added the required column `customerId` to the `Contracts` table without a default value. This is not possible if the table is not empty.
 - Added the required column `status` to the `Contracts` table without a default value. This is not possible if the table is not empty.
 
 */
-- CreateEnum
CREATE TYPE "public"."ContractsStatus" AS ENUM (
  'carInspection',
  'priceNegotiation',
  'contractDraft',
  'contractSuccessful',
  'contractFailed'
);
-- DropForeignKey
ALTER TABLE "public"."Contracts" DROP CONSTRAINT "Contracts_custmorId_fkey";
-- DropIndex
DROP INDEX "public"."Contracts_custmorId_key";
-- AlterTable
ALTER TABLE "public"."Contracts" DROP COLUMN "alarms",
  DROP COLUMN "custmorId",
  ADD COLUMN "contractPrice" INTEGER NOT NULL,
  ADD COLUMN "customerId" INTEGER NOT NULL,
  ADD COLUMN "resolutionDate" TIMESTAMP(3) NOT NULL,
  ADD COLUMN "status" "public"."ContractsStatus" NOT NULL;
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
-- CreateIndex
CREATE UNIQUE INDEX "Contracts_customerId_key" ON "public"."Contracts"("customerId");
-- AddForeignKey
ALTER TABLE "public"."Contracts"
ADD CONSTRAINT "Contracts_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."Meetings"
ADD CONSTRAINT "Meetings_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."Contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."Alarms"
ADD CONSTRAINT "Alarms_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "public"."Meetings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;