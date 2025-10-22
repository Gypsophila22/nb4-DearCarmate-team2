-- DropForeignKey
ALTER TABLE "public"."Contracts" DROP CONSTRAINT "Contracts_customerId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Contracts" ADD CONSTRAINT "Contracts_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
