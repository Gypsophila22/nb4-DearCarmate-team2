import { customerRepository } from '../repositories/index.js';
import type { CustomerCsvRow } from '../schemas/customers.schema.js';
import prisma from '../../lib/prisma.js'; // Import prisma client
import { DuplicateCustomerError } from '../utils/DuplicateCustomerError.js'; // Add this import

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
          if (customerData.email) {
            existingCustomer = await customerRepository.findByEmail(
              customerData.email,
              tx,
            );
          } else if (customerData.phoneNumber) {
            existingCustomer = await customerRepository.findByPhoneNumber(
              customerData.phoneNumber,
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
            await customerRepository.createFromCsv(customerData, companyId, tx);
            results.created++;
          }
        } catch (error: unknown) {
          results.failed++;
          let errorMessage: string;
          if (error instanceof DuplicateCustomerError) {
            errorMessage = error.message;
          } else if (error instanceof Error) {
            errorMessage = error.message;
          } else {
            errorMessage = String(error);
          }
          results.errors.push({ data: customerData, error: errorMessage });
        }
      }
    });

    return results;
  },
};
