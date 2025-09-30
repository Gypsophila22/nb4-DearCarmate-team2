/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Companies` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
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

-- AlterTable
CREATE SEQUENCE "public".companies_id_seq;
ALTER TABLE "public"."Companies" ALTER COLUMN "id" SET DEFAULT nextval('"public".companies_id_seq');
ALTER SEQUENCE "public".companies_id_seq OWNED BY "public"."Companies"."id";

-- AlterTable
CREATE SEQUENCE "public".users_id_seq;
ALTER TABLE "public"."Users" ALTER COLUMN "id" SET DEFAULT nextval('"public".users_id_seq'),
ALTER COLUMN "imgUrl" DROP NOT NULL,
ALTER COLUMN "isAdmin" SET DEFAULT false;
ALTER SEQUENCE "public".users_id_seq OWNED BY "public"."Users"."id";

-- CreateIndex
CREATE UNIQUE INDEX "Companies_code_key" ON "public"."Companies"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "public"."Users"("email");
