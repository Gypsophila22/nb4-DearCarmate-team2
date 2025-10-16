import { z } from 'zod';

export const userPatchSchema = z.object({
  body: z
    .object({
      employeeNumber: z.string().min(1).optional(),
      phoneNumber: z.string().min(1).optional(),
      imgUrl: z.url().optional(),

      currentPassword: z.string().trim().min(1, '현재 비밀번호가 필요합니다.'),

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
      const wantsPasswordChange =
        v.password !== undefined || v.passwordConfirmation !== undefined;
      const hasProfileChange =
        v.employeeNumber !== undefined ||
        v.phoneNumber !== undefined ||
        v.imgUrl !== undefined;

      // 최소 하나는 바꾸라고 안내
      if (!wantsPasswordChange && !hasProfileChange) {
        ctx.addIssue({
          code: 'custom',
          path: [],
          message: '변경할 값이 없습니다.',
        });
      }

      // 비밀번호 변경 규칙
      if (wantsPasswordChange) {
        if (!v.currentPassword || v.currentPassword.trim().length === 0) {
          ctx.addIssue({
            code: 'custom',
            path: ['currentPassword'],
            message: '현재 비밀번호가 필요합니다.',
          });
        }
        if (!v.password) {
          ctx.addIssue({
            code: 'custom',
            path: ['password'],
            message: '새 비밀번호를 입력해주세요.',
          });
        }
        if (!v.passwordConfirmation) {
          ctx.addIssue({
            code: 'custom',
            path: ['passwordConfirmation'],
            message: '비밀번호 확인이 필요합니다.',
          });
        }
        if (
          v.password &&
          v.passwordConfirmation &&
          v.password !== v.passwordConfirmation
        ) {
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
