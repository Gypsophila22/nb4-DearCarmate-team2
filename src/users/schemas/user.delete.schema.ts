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
