<<<<<<< HEAD
import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { z } from 'zod';

const userDeleteParamSchema = z
  .object({
    id: z
      .string()
      .regex(/^\d+$/, { message: 'id는 숫자여야 합니다.' })
      .transform((v) => Number(v))
      .refine((n) => n > 0, { message: 'id는 1 이상의 정수여야 합니다.' }),
  })
  .strict();

export function validatedserDeleteParam(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const result = userDeleteParamSchema.safeParse(req.params);

  if (result.success) {
    return next();
  } else {
    return next(createError(400, `잘못된 입력값입니다.`));
  }
}
=======
import { z } from 'zod';

export const userDeleteParamSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(/^\d+$/, 'id는 숫자여야 합니다.')
      .transform((v) => Number(v))
      .refine((n) => n > 0, 'id는 1 이상의 정수여야 합니다.'),
  }),
});

export type UserDeleteParams = z.infer<typeof userDeleteParamSchema>['params'];
>>>>>>> 5994e76 (feat: user, auth 레이어드 아키텍처 적용, 이미지 등록, 이메일 전송 (#28))
