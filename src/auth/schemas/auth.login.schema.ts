import { z } from 'zod';

export const authLoginSchema = z.object({
  body: z.object({
    email: z.email('이메일 형식이 올바르지 않습니다.'),
    password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
  }),
});

export type AuthLoginInput = z.infer<typeof authLoginSchema>['body'];
