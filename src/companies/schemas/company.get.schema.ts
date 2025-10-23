import { z } from 'zod';

export const getCompanyQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).default(10),
    searchBy: z.enum(['companyName', 'companyCode']).optional(),
    keyword: z.string().optional(),
  }),
});
