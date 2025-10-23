import { z } from 'zod';

// ✅ 회사 수정 요청 스키마
export const patchCompanySchema = z.object({
  params: z.object({
    companyId: z.coerce
      .number()
      .int()
      .positive('companyId는 양의 정수여야 합니다.'),
  }),
  body: z.object({
    companyName: z.string().min(1, '회사명은 필수입니다.'),
    companyCode: z.string().min(1, '회사코드는 필수입니다.'),
  }),
});

export type PatchCompanyParams = z.infer<typeof patchCompanySchema>['params'];
export type PatchCompanyBody = z.infer<typeof patchCompanySchema>['body'];
