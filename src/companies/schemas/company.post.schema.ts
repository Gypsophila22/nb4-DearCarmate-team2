import { z } from 'zod';

// ✅ 회사 등록 요청 스키마
export const createCompanySchema = z.object({
  body: z.object({
    companyName: z.string().min(1, '회사명은 필수입니다.'),
    companyCode: z.string().min(1, '회사코드는 필수입니다.'),
  }),
});

export type CreateCompanyBody = z.infer<typeof createCompanySchema>['body'];
