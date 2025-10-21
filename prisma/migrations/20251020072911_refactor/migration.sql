-- CreateEnum
CREATE TYPE "public"."CarType" AS ENUM ('SUV', '세단', '경차');

-- CreateEnum
CREATE TYPE "public"."CarStatus" AS ENUM ('possession', 'contractProceeding', 'contractCompleted');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "public"."AgeGroup" AS ENUM ('GENERATION_10', 'GENERATION_20', 'GENERATION_30', 'GENERATION_40', 'GENERATION_50', 'GENERATION_60', 'GENERATION_70', 'GENERATION_80');

-- CreateEnum
CREATE TYPE "public"."Region" AS ENUM ('서울', '경기', '인천', '강원', '충북', '충남', '세종', '대전', '전북', '전남', '광주', '경북', '경남', '대구', '울산', '부산', '제주');

-- CreateTable
CREATE TABLE "public"."Users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "employeeNumber" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "imageUrl" TEXT,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Companies" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cars" (
    "id" SERIAL NOT NULL,
    "carNumber" TEXT NOT NULL,
    "manufacturingYear" INTEGER NOT NULL,
    "mileage" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "accidentCount" INTEGER NOT NULL,
    "explanation" TEXT NOT NULL,
    "accidentDetails" TEXT NOT NULL,
    "status" "public"."CarStatus" NOT NULL DEFAULT 'possession',
    "modelId" INTEGER NOT NULL,

    CONSTRAINT "Cars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CarModel" (
    "id" SERIAL NOT NULL,
    "model" TEXT NOT NULL,
    "type" "public"."CarType" NOT NULL,
    "manufacturer" TEXT NOT NULL,

    CONSTRAINT "CarModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Customers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "ageGroup" "public"."AgeGroup",
    "region" "public"."Region",
    "email" TEXT,
    "memo" TEXT,
    "contractCount" INTEGER NOT NULL DEFAULT 0,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "Customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contracts" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "alarms" TIMESTAMP(3)[],
    "carId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,

    CONSTRAINT "Contracts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "public"."Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Companies_companyCode_key" ON "public"."Companies"("companyCode");

-- CreateIndex
CREATE UNIQUE INDEX "Cars_id_key" ON "public"."Cars"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CarModel_manufacturer_model_key" ON "public"."CarModel"("manufacturer", "model");

-- CreateIndex
CREATE UNIQUE INDEX "Contracts_carId_key" ON "public"."Contracts"("carId");

-- AddForeignKey
ALTER TABLE "public"."Users" ADD CONSTRAINT "Users_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cars" ADD CONSTRAINT "Cars_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "public"."CarModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Customers" ADD CONSTRAINT "Customers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contracts" ADD CONSTRAINT "Contracts_carId_fkey" FOREIGN KEY ("carId") REFERENCES "public"."Cars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contracts" ADD CONSTRAINT "Contracts_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
