import { z } from 'zod';

export const userRegisterSchema = z.object({
  body: z
    .object({
      name: z.string().min(1, '이름을 입력해야 합니다.'),
      email: z.email('이메일 형식이 올바르지 않습니다.'),
      employeeNumber: z.string().min(1, '사번을 입력해야 합니다.'),
      phoneNumber: z.string().min(1, '전화번호를 입력해야 합니다.'),
      password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
      passwordConfirmation: z
        .string()
        .min(1, '비밀번호 확인을 입력해야 합니다.'),
      company: z.string().min(1, '회사명을 입력해야 합니다.'),
      companyCode: z.string().min(1, '회사 코드를 입력해야 합니다.'),
    })
    .superRefine((val, ctx) => {
      if (val.password !== val.passwordConfirmation) {
        ctx.addIssue({
          code: 'custom',
          path: ['passwordConfirmation'],
          message: '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
        });
      }
    }),
});

export type RegisterBody = z.infer<typeof userRegisterSchema>['body'];
