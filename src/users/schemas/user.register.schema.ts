import { z } from 'zod';

export const userRegisterSchema = z.object({
  body: z
    .object({
      name: z.string({ error: '이름은 필수입니다.' }),
      email: z.email({ error: '잘못된 이메일 형식입니다.' }),
      employeeNumber: z.string({ error: '사번은 필수입니다.' }),
      phoneNumber: z
        .string({ error: '전화번호는 필수입니다.' })
        .regex(/^\d{2,4}-\d{3,4}-\d{4}$|^\d{9,11}$/, {
          error: '전화번호 형식이 올바르지 않습니다.',
        }),
      password: z
        .string({ error: '비밀번호는 필수입니다.' })
        .min(8, { error: '비밀번호는 8자 이상이어야 합니다.' }),
      passwordConfirmation: z.string({ error: '비밀번호 확인은 필수입니다.' }),
      companyName: z.string({ error: '회사명은 필수입니다.' }),
      companyCode: z.string({ error: '회사코드는 필수입니다.' }),
    })
    .refine(
      ({ password, passwordConfirmation }) => password === passwordConfirmation,
      {
        message: '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
        path: ['passwordConfirmation'],
      }
    ),
});

export type RegisterBody = z.infer<typeof userRegisterSchema>['body'];
