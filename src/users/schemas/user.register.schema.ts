import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { z } from 'zod';

const userRegisterSchema = z
  .object({
    name: z.string({ error: '이름은 필수입니다.' }),
    email: z.email({ error: '잘못된 이메일 형식입니다.' }),
    employeeNumber: z.string({ error: '사번은 필수입니다.' }),
    phoneNumber: z
      .string({ error: '전화번호는 필수입니다.' })
      .regex(/^0\d{1,2}-\d{3,4}-\d{4}$/, {
        error: '전화번호 형식이 올바르지 않습니다(-을 추가해 주세요).',
      }),
    password: z
      .string({ error: '비밀번호는 필수입니다.' })
      .min(8, { error: '비밀번호는 8자 이상이어야 합니다.' }),
    passwordConfirmation: z.string({ error: '비밀번호 확인은 필수입니다.' }),
    company: z.string({ error: '회사명은 필수입니다.' }),
    companyCode: z.string({ error: '회사코드는 필수입니다.' }),
  })
  .refine(
    ({ password, passwordConfirmation }) => password === passwordConfirmation,
    {
      message: '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
      path: ['passwordConfirmation'],
    }
  )
  .strict();

export function validatedUserRegister(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const result = userRegisterSchema.safeParse(req.body);

  if (result.success) {
    return next();
  } else {
    return next(createError(400, `잘못된 입력값입니다.`));
  }
}
