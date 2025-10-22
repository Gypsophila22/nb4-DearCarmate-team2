import createError from 'http-errors';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { z } from 'zod';
import { customerCsvRowSchema } from '../schemas/customers.schema.js';
import { AgeGroup } from '@prisma/client';

const ageGroupMap: Record<string, AgeGroup> = {
  '10대': AgeGroup.GENERATION_10,
  '20대': AgeGroup.GENERATION_20,
  '30대': AgeGroup.GENERATION_30,
  '40대': AgeGroup.GENERATION_40,
  '50대': AgeGroup.GENERATION_50,
  '60대': AgeGroup.GENERATION_60,
  '70대': AgeGroup.GENERATION_70,
  '80대': AgeGroup.GENERATION_80,
};

const getAgeGroupFromRange = (ageRange: string | undefined | null): AgeGroup | null => {
  if (!ageRange) return null;

  const match = ageRange.match(/^(\d{2})-\d{2}$/);
  if (match && match[1]) {
    const decade = `${match[1]}대`;
    return ageGroupMap[decade] || null;
  }

  return ageGroupMap[ageRange] || null;
};

export const customerParseService = {
  async parseAndValidateCsv(buffer: Buffer) {
    const results: z.infer<typeof customerCsvRowSchema>[] = [];
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
            const transformedData = {
              ...parsed.data,
              ageGroup: getAgeGroupFromRange(parsed.data.ageGroup), // Use the helper function
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
