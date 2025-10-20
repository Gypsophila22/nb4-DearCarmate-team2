import type { Gender } from '@prisma/client';
import prisma from '../../lib/prisma.ts';

interface CustomerUploadData {
  고객명: string;
  성별: Gender;
  연락처: string;
  연령대?: string;
  지역?: string;
  이메일?: string;
  메모?: string;
}

export const customerUploadService = {
  async processCustomerCsv(customers: CustomerUploadData[]) {
    const results = {
      created: 0,
      updated: 0,
      failed: 0,
      errors: [] as { data: CustomerUploadData; error: any }[],
    };

    for (const customerData of customers) {
      try {
        let existingCustomer;
        if (customerData.이메일) {
          existingCustomer = await prisma.customers.findUnique({
            where: { email: customerData.이메일 },
          });
        } else if (customerData.연락처) {
          existingCustomer = await prisma.customers.findUnique({
            where: { phoneNumber: customerData.연락처 },
          });
        }

        if (existingCustomer) {
          // 기존 고객이 있으면 업데이트
          await prisma.customers.update({
            where: { id: existingCustomer.id },
            data: {
              name: customerData.고객명,
              gender: customerData.성별,
              phoneNumber: customerData.연락처,
              ageGroup: customerData.연령대,
              region: customerData.지역,
              email: customerData.이메일,
              memo: customerData.메모,
            },
          });
          results.updated++;
        } else {
          // 새 고객 생성
          await prisma.customers.create({
            data: {
              name: customerData.고객명,
              gender: customerData.성별,
              phoneNumber: customerData.연락처,
              ageGroup: customerData.연령대,
              region: customerData.지역,
              email: customerData.이메일,
              memo: customerData.메모,
            },
          });
          results.created++;
        }
      } catch (error: any) {
        results.failed++;
        results.errors.push({ data: customerData, error: error.message });
      }
    }

    return results;
  },
};
