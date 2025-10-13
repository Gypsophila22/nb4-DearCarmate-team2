// src/users/schemas/user.patch.schema.ts
import { z } from 'zod';

export const userPatchSchema = z.object({
  body: z
    .object({
      employeeNumber: z.string().min(1).optional(),
      phoneNumber: z.string().min(1).optional(),
      imageUrl: z.string().url().optional(),

      currentPassword: z.string().min(1, '현재 비밀번호가 필요합니다.'),

      password: z
        .string()
        .min(8, '비밀번호는 8자 이상이어야 합니다.')
        .optional(),
      passwordConfirmation: z
        .string()
        .min(1, '비밀번호 확인이 필요합니다.')
        .optional(),
    })
    .superRefine((v, ctx) => {
      // 새 비밀번호를 바꾸려는 경우에만 확인 체크
      if (v.password) {
        if (!v.passwordConfirmation) {
          ctx.addIssue({
            code: 'custom',
            path: ['passwordConfirmation'],
            message: '비밀번호 확인이 필요합니다.',
          });
        } else if (v.password !== v.passwordConfirmation) {
          ctx.addIssue({
            code: 'custom',
            path: ['passwordConfirmation'],
            message: '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
          });
        }
      }
    }),
});

export type UserPatchBody = z.infer<typeof userPatchSchema>['body'];
