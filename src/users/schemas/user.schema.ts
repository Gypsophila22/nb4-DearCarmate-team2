import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { z } from 'zod';

export const userDeleteParamSchema = z
  .object({
    id: z.coerce.number(),
  })
  .strict();

const userPatchSchema = z
  .object({
    employeeNumber: z.string().min(1).optional(),
    phoneNumber: z.string().min(1).optional(),
    imageUrl: z
      .url()
      .nullable()
      .optional()
      .transform((v) => v ?? undefined),
    currentPassword: z.string().trim().min(1, '현재 비밀번호가 필요합니다.'),
    password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.').optional(),
    passwordConfirmation: z
      .string()
      .min(1, '비밀번호 확인이 필요합니다.')
      .optional(),
  })
  .strict()
  .superRefine((v, ctx) => {
    const wantsPasswordChange =
      v.password !== undefined || v.passwordConfirmation !== undefined;
    const hasProfileChange =
      v.employeeNumber !== undefined ||
      v.phoneNumber !== undefined ||
      v.imageUrl !== undefined;

    // 최소 하나는 바꾸라고 안내
    if (!wantsPasswordChange && !hasProfileChange) {
      ctx.addIssue({
        code: 'custom',
        path: [],
        message: '변경할 값이 없습니다.',
      });
    }

    // 비밀번호 변경 규칙
    if (wantsPasswordChange) {
      if (!v.currentPassword || v.currentPassword.trim().length === 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['currentPassword'],
          message: '현재 비밀번호가 필요합니다.',
        });
      }
      if (!v.password) {
        ctx.addIssue({
          code: 'custom',
          path: ['password'],
          message: '새 비밀번호를 입력해주세요.',
        });
      }
      if (!v.passwordConfirmation) {
        ctx.addIssue({
          code: 'custom',
          path: ['passwordConfirmation'],
          message: '비밀번호 확인이 필요합니다.',
        });
      }
      if (
        v.password &&
        v.passwordConfirmation &&
        v.password !== v.passwordConfirmation
      ) {
        ctx.addIssue({
          code: 'custom',
          path: ['passwordConfirmation'],
          message: '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
        });
      }
    }
  });

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
    companyName: z.string({ error: '회사명은 필수입니다.' }),
    companyCode: z.string({ error: '회사코드는 필수입니다.' }),
  })
  .refine(
    ({ password, passwordConfirmation }) => password === passwordConfirmation,
    {
      message: '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
      path: ['passwordConfirmation'],
    },
  )
  .strict();

class UserSchema {
  userPatch(req: Request, res: Response, next: NextFunction) {
    const result = userPatchSchema.safeParse(req.body);

    if (result.success) {
      return next();
    } else {
      return next(createError(400, `잘못된 입력값입니다.`));
    }
  }

  userRegister(req: Request, res: Response, next: NextFunction) {
    const result = userRegisterSchema.safeParse(req.body);

    if (result.success) {
      return next();
    } else {
      return next(createError(400, `잘못된 입력값입니다.`));
    }
  }

  userDeleteParam(req: Request, res: Response, next: NextFunction) {
    const result = userDeleteParamSchema.safeParse(req.params);

    if (result.success) {
      return next();
    } else {
      return next(createError(400, `잘못된 입력값입니다.`));
    }
  }
}

export const userSchema = new UserSchema();
