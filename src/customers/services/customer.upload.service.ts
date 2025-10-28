import { customerRepository } from '../repositories/customer.repository.js';
import prisma from '../../lib/prisma.js';
import { toAgeGroupEnum, toRegionEnum } from '../utils/customer.mapper.js';
import { Prisma, AgeGroup, Gender, Region } from '@prisma/client';
import { z } from 'zod';
import { customerCsvRowSchema } from '../schemas/customer.schema.js';

type CustomerCsvRow = {
  name: string;
  email?: string;
  gender: Gender;
  phoneNumber: string;
  region?: Region;
  ageGroup?: AgeGroup;
  memo?: string;
};

type TransformedCustomerCsvRow = Omit<CustomerCsvRow, 'ageGroup' | 'region'> & {
  ageGroup?: AgeGroup;
  region?: Region;
};

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

    for (const customerData of validCustomersForDb) {
      try {
        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
          const transformedCustomerData: TransformedCustomerCsvRow = {
            ...customerData,
            ageGroup: toAgeGroupEnum(customerData.ageGroup),
            region: toRegionEnum(customerData.region),
          };

          let existingCustomer:
            | (CustomerCsvRow & {
                id: number;
                contractCount: number;
                createdAt: Date;
                updatedAt: Date;
                companyId: number;
              })
            | null
            | undefined;

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
            const hasChanges =
              existingCustomer.name !== transformedCustomerData.name ||
              existingCustomer.gender !== transformedCustomerData.gender ||
              existingCustomer.phoneNumber !==
                transformedCustomerData.phoneNumber ||
              existingCustomer.ageGroup !== transformedCustomerData.ageGroup ||
              existingCustomer.region !== transformedCustomerData.region ||
              existingCustomer.email !== transformedCustomerData.email ||
              existingCustomer.memo !== transformedCustomerData.memo;

            if (hasChanges) {
              await customerRepository.updateFromCsv(
                existingCustomer.id,
                transformedCustomerData,
                tx,
              );
              processedSuccessfully++;
            } else {
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
        });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        databaseErrors.push({ data: customerData, error: errorMessage });
      }
    }

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
