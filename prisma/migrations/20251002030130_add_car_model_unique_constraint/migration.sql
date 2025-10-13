/*
  Warnings:

  - A unique constraint covering the columns `[manufacturer,model]` on the table `CarModel` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CarModel_manufacturer_model_key" ON "public"."CarModel"("manufacturer", "model");

-- AddForeignKey
ALTER TABLE "public"."Cars" ADD CONSTRAINT "Cars_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "public"."CarModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
