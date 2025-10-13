/*
  Warnings:

  - The `region` column on the `Customers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `companyId` to the `Customers` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `gender` on the `Customers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "public"."Cars_id_key";

-- DropIndex
DROP INDEX "public"."Contracts_id_key";

-- DropIndex
DROP INDEX "public"."Customers_id_key";

-- AlterTable
CREATE SEQUENCE "public".cars_id_seq;
ALTER TABLE "public"."Cars" ALTER COLUMN "id" SET DEFAULT nextval('"public".cars_id_seq');
ALTER SEQUENCE "public".cars_id_seq OWNED BY "public"."Cars"."id";

-- AlterTable
CREATE SEQUENCE "public".contracts_id_seq;
ALTER TABLE "public"."Contracts" ALTER COLUMN "id" SET DEFAULT nextval('"public".contracts_id_seq');
ALTER SEQUENCE "public".contracts_id_seq OWNED BY "public"."Contracts"."id";

-- AlterTable
CREATE SEQUENCE "public".customers_id_seq;
ALTER TABLE "public"."Customers" ADD COLUMN     "companyId" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('"public".customers_id_seq'),
DROP COLUMN "gender",
ADD COLUMN     "gender" "public"."Gender" NOT NULL,
ALTER COLUMN "ageGroup" DROP NOT NULL,
DROP COLUMN "region",
ADD COLUMN     "region" "public"."Region",
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "memo" DROP NOT NULL;
ALTER SEQUENCE "public".customers_id_seq OWNED BY "public"."Customers"."id";

-- AddForeignKey
ALTER TABLE "public"."Customers" ADD CONSTRAINT "Customers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
