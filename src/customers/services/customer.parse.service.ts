import createError from 'http-errors';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { z } from 'zod';
import { customerValidation } from '../schemas/customer.schema.js';
import { toAgeGroupEnum, toRegionEnum } from '../utils/customer.mapper.js';
import { AgeGroup, Gender, Region } from '@prisma/client';

type CustomerCsvRow = z.infer<
  ReturnType<typeof customerValidation.getCustomerCsvRowSchema>
>;
type TransformedCustomerCsvRow = Omit<CustomerCsvRow, 'ageGroup' | 'region'> & {
  ageGroup?: AgeGroup;
  region?: Region;
};

export const customerParseService = {
  async parseAndValidateCsv(buffer: Buffer) {
    const customerCsvRowSchema = customerValidation.getCustomerCsvRowSchema();
    const results: CustomerCsvRow[] = [];
    const errors: {
      row: number;
      data: Record<string, string>;
      errors: z.ZodIssue[];
    }[] = [];
    let rowNumber = 1;

    const stream = Readable.from(buffer);

    await new Promise<void>((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (data) => {
          rowNumber++;
          const parsed = customerCsvRowSchema.safeParse(data);
          if (parsed.success) {
            const transformedData: TransformedCustomerCsvRow = {
              ...parsed.data,
              ageGroup: toAgeGroupEnum(parsed.data.ageGroup),
              region: toRegionEnum(parsed.data.region),
            };
            results.push(transformedData);
          } else {
            errors.push({ row: rowNumber, data, errors: parsed.error.issues });
          }
        })
        .on('end', () => {
          resolve();
        })
        .on('error', (error) => {
          reject(createError(400, `CSV 파싱 오류: ${error.message}`));
        });
    });

    return { results, errors };
  },
};
