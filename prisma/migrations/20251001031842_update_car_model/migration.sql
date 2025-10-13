-- AlterTable
CREATE SEQUENCE "public".cars_id_seq;
ALTER TABLE "public"."Cars" DROP COLUMN "contractId",
ALTER COLUMN "id" SET DEFAULT nextval('"public".cars_id_seq');
ALTER SEQUENCE "public".cars_id_seq OWNED BY "public"."Cars"."id";
