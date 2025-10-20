import { z } from 'zod';

export const getCustomersSchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
    pageSize: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
    searchBy: z.enum(['name', 'email']).optional(),
    keyword: z.string().optional(),
  }),
});

export type GetCustomersQuery = z.infer<typeof getCustomersSchema>['query'];
