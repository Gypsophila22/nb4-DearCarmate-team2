/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Companies` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Companies` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `imgUrl` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Companies" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "public"."Users" DROP COLUMN "createdAt",
DROP COLUMN "imgUrl",
DROP COLUMN "updatedAt",
ADD COLUMN     "imageUrl" TEXT;
