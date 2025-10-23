import { z } from 'zod';

export const deleteCompanySchema = z.object({
  params: z.object({
    companyId: z.coerce.number(), // 문자열이든 숫자든 자동 변환
  }),
});
