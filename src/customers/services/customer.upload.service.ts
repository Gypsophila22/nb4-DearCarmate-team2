import type { Gender } from '@prisma/client';
import prisma from '../../lib/prisma.ts';

interface CustomerUploadData {
  customerName: string;
  gender: Gender;
  phoneNumber: string;
  ageGroup?: string;
  region?: string;
  email?: string;
  memo?: string;
}

export const customerUploadService = {
  async processCustomerCsv(customers: CustomerUploadData[]) {
    const results = {
      created: 0,
      updated: 0,
      failed: 0,
      errors: [] as { data: CustomerUploadData; error: string }[],
    };

    await prisma.$transaction(async (tx) => {
      for (const customerData of customers) {
        try {
          let existingCustomer;
          if (customerData.email) {
            existingCustomer = await tx.customers.findFirst({
              where: { email: customerData.email },
            });
          } else if (customerData.phoneNumber) {
            existingCustomer = await tx.customers.findFirst({
              where: { phoneNumber: customerData.phoneNumber },
            });
          }

          if (existingCustomer) {
            // 기존 고객이 있으면 업데이트
            await tx.customers.update({
              where: { id: existingCustomer.id },
              data: {
                name: customerData.customerName,
                gender: customerData.gender,
                phoneNumber: customerData.phoneNumber,
                ageGroup: customerData.ageGroup,
                region: customerData.region,
                email: customerData.email,
                memo: customerData.memo,
              },
            });
            results.updated++;
          } else {
            // 새 고객 생성
            await tx.customers.create({
              data: {
                name: customerData.customerName,
                gender: customerData.gender,
                phoneNumber: customerData.phoneNumber,
                ageGroup: customerData.ageGroup,
                region: customerData.region,
                email: customerData.email,
                memo: customerData.memo,
              },
            });
            results.created++;
          }
        } catch (error: unknown) {
          results.failed++;
          results.errors.push({
            data: customerData,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    });

    return results;
  },
};
