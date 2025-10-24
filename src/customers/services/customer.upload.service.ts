import { customerRepository } from '../repositories/customer.repository.js';
import { customerCsvRowSchema } from '../schemas/customer.schema.js';
import type {
  CustomerCsvRow,
  TransformedCustomerCsvRow,
} from '../schemas/customer.schema.js';
import prisma from '../../lib/prisma.js';
import { toAgeGroupEnum, toRegionEnum } from '../utils/customer.mapper.js';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

export type CustomerCsvValidationError = {
  row: number;
  data: Record<string, string>;
  errors: { message: string; path: PropertyKey[]; code: z.ZodIssue['code'] }[];
};

export type CustomerDatabaseError = {
  data: CustomerCsvRow;
  error: string;
};

export type BulkUploadResponse = {
  message: string;
  fileName: string;
  totalRecords: number;
  processedSuccessfully: number;
  failedRecords: number;
  validationErrors: CustomerCsvValidationError[];
  databaseErrors: CustomerDatabaseError[];
};

export const customerUploadService = {
  async processCustomerCsv(
    customers: CustomerCsvRow[],
    companyId: number,
    fileName: string,
  ): Promise<BulkUploadResponse> {
    const totalRecords = customers.length;
    let processedSuccessfully = 0;
    const validationErrors: CustomerCsvValidationError[] = [];
    const databaseErrors: CustomerDatabaseError[] = [];
    const validCustomersForDb: CustomerCsvRow[] = [];

    customers.forEach((customerData, index) => {
      const validationResult = customerCsvRowSchema.safeParse(customerData);
      if (!validationResult.success) {
        validationErrors.push({
          row: index + 1,
          data: customerData,
          errors: validationResult.error.issues.map((issue) => ({
            message: issue.message,
            path: issue.path,
            code: issue.code,
          })),
        });
      } else {
        validCustomersForDb.push(customerData);
      }
    });

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      for (const customerData of validCustomersForDb) {
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
            // 변경사항 비교
            const hasChanges = (
              existingCustomer.name !== transformedCustomerData.name ||
              existingCustomer.gender !== transformedCustomerData.gender ||
              existingCustomer.phoneNumber !== transformedCustomerData.phoneNumber ||
              existingCustomer.ageGroup !== transformedCustomerData.ageGroup ||
              existingCustomer.region !== transformedCustomerData.region ||
              existingCustomer.email !== transformedCustomerData.email ||
              existingCustomer.memo !== transformedCustomerData.memo
            );

            if (hasChanges) {
              await customerRepository.updateFromCsv(
                existingCustomer.id,
                transformedCustomerData,
                tx,
              );
              processedSuccessfully++;
            } else {
              // 중복 확인
              databaseErrors.push({
                data: customerData,
                error: '중복된 기록은 변경사항이 기록되지 않습니다.',
              });
            }
          } else {
            await customerRepository.createFromCsv(
              transformedCustomerData,
              companyId,
              tx,
            );
            processedSuccessfully++;
          }
        } catch (error: unknown) {
          let errorMessage: string;
          if (error instanceof Error) {
            errorMessage = error.message;
          } else {
            errorMessage = String(error);
          }
          databaseErrors.push({ data: customerData, error: errorMessage });
        }
      }
    });

    const failedRecords = validationErrors.length + databaseErrors.length;

    return {
      message: '업로드가 성공적으로 완료되었습니다.',
      fileName,
      totalRecords,
      processedSuccessfully,
      failedRecords,
      validationErrors,
      databaseErrors,
    };
  },
};
