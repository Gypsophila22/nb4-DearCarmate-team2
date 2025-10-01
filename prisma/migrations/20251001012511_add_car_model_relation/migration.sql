/*
  Warnings:

  - You are about to drop the column `manufacturer` on the `Cars` table. All the data in the column will be lost.
  - You are about to drop the column `model` on the `Cars` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Cars` table. All the data in the column will be lost.
  - Added the required column `carNumber` to the `Cars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modelId` to the `Cars` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."CarType" AS ENUM ('SUV', '세단', '경차');

-- CreateEnum
CREATE TYPE "public"."CarStatus" AS ENUM ('possession', 'contractProceeding', 'contractCompleted');

-- AlterTable
ALTER TABLE "public"."Cars" DROP COLUMN "manufacturer",
DROP COLUMN "model",
DROP COLUMN "number",
ADD COLUMN     "carNumber" TEXT NOT NULL,
ADD COLUMN     "contractId" INTEGER,
ADD COLUMN     "modelId" INTEGER NOT NULL,
ADD COLUMN     "status" "public"."CarStatus" NOT NULL DEFAULT 'possession';

-- CreateTable
CREATE TABLE "public"."CarModel" (
    "id" SERIAL NOT NULL,
    "model" TEXT NOT NULL,
    "type" "public"."CarType" NOT NULL,
    "manufacturer" TEXT NOT NULL,

    CONSTRAINT "CarModel_pkey" PRIMARY KEY ("id")
);
