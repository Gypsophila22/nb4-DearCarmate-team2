-- DropForeignKey
ALTER TABLE "public"."Contracts" DROP CONSTRAINT "Contracts_carId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Contracts" ADD CONSTRAINT "Contracts_carId_fkey" FOREIGN KEY ("carId") REFERENCES "public"."Cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;
