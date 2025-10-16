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
