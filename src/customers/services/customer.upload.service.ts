import { customerRepository } from '../repositories/index.js';
import type {
  CustomerCsvRow,
  TransformedCustomerCsvRow,
} from '../schemas/customer.schema.js';
import prisma from '../../lib/prisma.js';
import { toAgeGroupEnum, toRegionEnum } from '../utils/customer.mapper.js';
import { Prisma } from '@prisma/client';

export const customerUploadService = {
  async processCustomerCsv(customers: CustomerCsvRow[], companyId: number) {
    const results = {
      created: 0,
      updated: 0,
      failed: 0,
      errors: [] as { data: CustomerCsvRow; error: string }[],
    };

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      for (const customerData of customers) {
        const transformedCustomerData: TransformedCustomerCsvRow = {
          ...customerData,
          ageGroup: toAgeGroupEnum(customerData.ageGroup),
          region: toRegionEnum(customerData.region),
        };

        try {
          let existingCustomer;
          if (transformedCustomerData.email) {
            existingCustomer = await customerRepository.findByEmail(
              transformedCustomerData.email,
              tx,
            );
          } else if (transformedCustomerData.phoneNumber) {
            existingCustomer = await customerRepository.findByPhoneNumber(
              transformedCustomerData.phoneNumber,
              tx,
            );
          }

          if (existingCustomer) {
            await customerRepository.updateFromCsv(
              existingCustomer.id,
              transformedCustomerData,
              tx,
            );
            results.updated++;
          } else {
            await customerRepository.createFromCsv(
              transformedCustomerData,
              companyId,
              tx,
            );
            results.created++;
          }
        } catch (error: unknown) {
          results.failed++;
          let errorMessage: string;
          if (error instanceof Error) {
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
