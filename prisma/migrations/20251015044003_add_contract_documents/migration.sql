-- CreateTable
CREATE TABLE "public"."ContractDocuments" (
    "id" SERIAL NOT NULL,
    "originalName" TEXT NOT NULL,
    "storedName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "path" TEXT,
    "url" TEXT,
    "contractId" INTEGER NOT NULL,
    "uploaderId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractDocuments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContractDocuments_contractId_idx" ON "public"."ContractDocuments"("contractId");

-- CreateIndex
CREATE INDEX "ContractDocuments_companyId_idx" ON "public"."ContractDocuments"("companyId");

-- CreateIndex
CREATE INDEX "ContractDocuments_uploaderId_idx" ON "public"."ContractDocuments"("uploaderId");

-- AddForeignKey
ALTER TABLE "public"."ContractDocuments" ADD CONSTRAINT "ContractDocuments_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."Contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContractDocuments" ADD CONSTRAINT "ContractDocuments_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContractDocuments" ADD CONSTRAINT "ContractDocuments_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
