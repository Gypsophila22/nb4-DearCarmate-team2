import { customerRepository } from '../repositories/index.js';
import type { CustomerCsvRow } from '../schemas/customers.schema.js';
import prisma from '../../lib/prisma.ts'; // Import prisma client

export const customerUploadService = {
  async processCustomerCsv(customers: CustomerCsvRow[], companyId: number) {
    const results = {
      created: 0,
      updated: 0,
      failed: 0,
      errors: [] as { data: CustomerCsvRow; error: string }[],
    };

    await prisma.$transaction(async (tx) => {
      for (const customerData of customers) {
        try {
          let existingCustomer;
          if (customerData.이메일) {
            existingCustomer = await customerRepository.findByEmail(
              customerData.이메일,
              tx,
            );
          } else if (customerData.연락처) {
            existingCustomer = await customerRepository.findByPhoneNumber(
              customerData.연락처,
              tx,
            );
          }

          if (existingCustomer) {
            await customerRepository.updateFromCsv(
              existingCustomer.id,
              customerData,
              tx,
            );
            results.updated++;
          } else {
            await customerRepository.createFromCsv(
              customerData,
              companyId,
              tx,
            );
            results.created++;
          }
        } catch (error: unknown) {
          results.failed++;
          const message = error instanceof Error ? error.message : String(error);
          results.errors.push({ data: customerData, error: message });
          throw error;
        }
      }
    });

    return results;
  },
};
