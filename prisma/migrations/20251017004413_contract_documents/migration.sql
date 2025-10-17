/*
  Warnings:

  - You are about to drop the column `code` on the `Companies` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Companies` table. All the data in the column will be lost.
  - The `ageGroup` column on the `Customers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[companyCode]` on the table `Companies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyCode` to the `Companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyName` to the `Companies` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Companies_code_key";

-- AlterTable
ALTER TABLE "public"."Companies" DROP COLUMN "code",
DROP COLUMN "name",
ADD COLUMN     "companyCode" TEXT NOT NULL,
ADD COLUMN     "companyName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Customers" DROP COLUMN "ageGroup",
ADD COLUMN     "ageGroup" "public"."AgeGroup";

-- CreateIndex
CREATE UNIQUE INDEX "Companies_companyCode_key" ON "public"."Companies"("companyCode");
