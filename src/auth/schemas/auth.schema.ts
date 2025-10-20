import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { z } from 'zod';

const authLogin = z
  .object({
    email: z.email('이메일 형식이 올바르지 않습니다.'),
    password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
  })
  .strict();

class AuthSchema {
  authLoginSchema(req: Request, res: Response, next: NextFunction) {
    const result = authLogin.safeParse(req.body);

    if (result.success) {
      return next();
    } else {
      return next(createError(400, `잘못된 입력값입니다.`));
    }
  }
}

export const authSchema = new AuthSchema();
