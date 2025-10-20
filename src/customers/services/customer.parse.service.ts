import createError from 'http-errors';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { z } from 'zod';
import { customerCsvRowSchema } from '../schemas/customers.schema.js';

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
            results.push(parsed.data);
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
