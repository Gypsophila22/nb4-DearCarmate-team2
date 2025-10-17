import createError from 'http-errors';
import { z } from 'zod';

import type { Request, Response, NextFunction } from 'express';

const authLoginSchema = z
  .object({
    email: z.email('이메일 형식이 올바르지 않습니다.'),
    password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
  })
  .strict();

export function authLogin(req: Request, res: Response, next: NextFunction) {
  const result = authLoginSchema.safeParse(req.body);

  if (result.success) {
    return next();
  } else {
    return next(createError(400, `잘못된 입력값입니다.`));
  }
}
