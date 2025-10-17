/*
  Warnings:

  - The values [MALE,FEMALE] on the enum `Gender` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `custmorId` on the `Contracts` table. All the data in the column will be lost.
  - The `ageGroup` column on the `Customers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `customerId` to the `Contracts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Gender_new" AS ENUM ('male', 'female');
ALTER TABLE "public"."Customers" ALTER COLUMN "gender" TYPE "public"."Gender_new" USING ("gender"::text::"public"."Gender_new");
ALTER TYPE "public"."Gender" RENAME TO "Gender_old";
ALTER TYPE "public"."Gender_new" RENAME TO "Gender";
DROP TYPE "public"."Gender_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Contracts" DROP CONSTRAINT "Contracts_custmorId_fkey";

-- DropIndex
DROP INDEX "public"."Contracts_custmorId_key";

-- AlterTable
ALTER TABLE "public"."Contracts" DROP COLUMN "custmorId",
ADD COLUMN     "customerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Customers" ADD COLUMN     "contractCount" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "ageGroup",
ADD COLUMN     "ageGroup" "public"."AgeGroup";

-- AddForeignKey
ALTER TABLE "public"."Contracts" ADD CONSTRAINT "Contracts_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
