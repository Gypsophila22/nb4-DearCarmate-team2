import { z } from 'zod';

// ✅ 회사별 유저 조회 쿼리 스키마
export const getCompanyUsersQuerySchema = z.object({
  page: z.coerce.number().min(1, 'page는 1 이상이어야 합니다.').default(1),
  pageSize: z.coerce
    .number()
    .min(1, 'pageSize는 1 이상이어야 합니다.')
    .default(10),
  searchBy: z.enum(['companyName', 'name', 'email']).optional(),
  keyword: z.string().optional(),
});

export type GetCompanyUsersQuery = z.infer<typeof getCompanyUsersQuerySchema>;
