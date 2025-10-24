/*
  Warnings:

  - The values [LIGHT,MEDIUM,HEAVY,SPORTS] on the enum `CarType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CarType_new" AS ENUM ('SUV', '세단', '경차');
ALTER TABLE "CarModel" ALTER COLUMN "type" TYPE "CarType_new" USING ("type"::text::"CarType_new");
ALTER TYPE "CarType" RENAME TO "CarType_old";
ALTER TYPE "CarType_new" RENAME TO "CarType";
DROP TYPE "CarType_old";
COMMIT;
