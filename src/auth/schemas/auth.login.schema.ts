<<<<<<< HEAD
import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { z } from 'zod';

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
=======
import { z } from 'zod';

export const authLoginSchema = z.object({
  body: z.object({
    email: z.email('이메일 형식이 올바르지 않습니다.'),
    password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
  }),
});

export type AuthLoginInput = z.infer<typeof authLoginSchema>['body'];
>>>>>>> 5994e76 (feat: user, auth 레이어드 아키텍처 적용, 이미지 등록, 이메일 전송 (#28))
