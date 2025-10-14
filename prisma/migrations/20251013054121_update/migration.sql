/*
  Warnings:

  - The `region` column on the `Customers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `companyId` to the `Customers` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `gender` on the `Customers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "Contracts_id_key";

-- DropIndex
DROP INDEX "Customers_id_key";

-- AlterTable
CREATE SEQUENCE contracts_id_seq;
ALTER TABLE "Contracts" ALTER COLUMN "id" SET DEFAULT nextval('contracts_id_seq');
ALTER SEQUENCE contracts_id_seq OWNED BY "Contracts"."id";

-- AlterTable
CREATE SEQUENCE customers_id_seq;
ALTER TABLE "Customers" ADD COLUMN     "companyId" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('customers_id_seq'),
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL,
ALTER COLUMN "ageGroup" DROP NOT NULL,
DROP COLUMN "region",
ADD COLUMN     "region" "Region",
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "memo" DROP NOT NULL;
ALTER SEQUENCE customers_id_seq OWNED BY "Customers"."id";

-- AddForeignKey
ALTER TABLE "Customers" ADD CONSTRAINT "Customers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
