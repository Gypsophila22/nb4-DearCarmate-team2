/*
  Warnings:

  - You are about to drop the column `manufacturer` on the `Cars` table. All the data in the column will be lost.
  - You are about to drop the column `model` on the `Cars` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Cars` table. All the data in the column will be lost.
  - You are about to drop the column `custmorId` on the `Contracts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[customerId]` on the table `Contracts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `carNumber` to the `Cars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modelId` to the `Cars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `Contracts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."CarType" AS ENUM ('SUV', '세단', '경차');

-- CreateEnum
CREATE TYPE "public"."CarStatus" AS ENUM ('possession', 'contractProceeding', 'contractCompleted');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."Region" ADD VALUE '광주';
ALTER TYPE "public"."Region" ADD VALUE '경북';
ALTER TYPE "public"."Region" ADD VALUE '경남';
ALTER TYPE "public"."Region" ADD VALUE '대구';
ALTER TYPE "public"."Region" ADD VALUE '울산';
ALTER TYPE "public"."Region" ADD VALUE '부산';
ALTER TYPE "public"."Region" ADD VALUE '제주';

-- DropForeignKey
ALTER TABLE "public"."Contracts" DROP CONSTRAINT "Contracts_custmorId_fkey";

-- DropIndex
DROP INDEX "public"."Contracts_custmorId_key";

-- AlterTable
ALTER TABLE "public"."Cars" DROP COLUMN "manufacturer",
DROP COLUMN "model",
DROP COLUMN "number",
ADD COLUMN     "carNumber" TEXT NOT NULL,
ADD COLUMN     "contractId" INTEGER,
ADD COLUMN     "modelId" INTEGER NOT NULL,
ADD COLUMN     "status" "public"."CarStatus" NOT NULL DEFAULT 'possession';

-- AlterTable
ALTER TABLE "public"."Contracts" DROP COLUMN "custmorId",
ADD COLUMN     "customerId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."CarModel" (
    "id" SERIAL NOT NULL,
    "model" TEXT NOT NULL,
    "type" "public"."CarType" NOT NULL,
    "manufacturer" TEXT NOT NULL,

    CONSTRAINT "CarModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contracts_customerId_key" ON "public"."Contracts"("customerId");

-- AddForeignKey
ALTER TABLE "public"."Cars" ADD CONSTRAINT "Cars_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "public"."CarModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contracts" ADD CONSTRAINT "Contracts_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
