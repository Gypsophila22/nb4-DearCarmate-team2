import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { z } from 'zod';

const companyRegisterSchema = z.object({
  body: z.object({
    companyName: z.string().min(1, '회사명은 필수입니다.'),
    companyCode: z.string().min(1, '회사코드는 필수입니다.'),
  }),
});

const companyGetSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).default(10),
    searchBy: z.enum(['companyName', 'companyCode']).optional(),
    keyword: z.string().optional(),
  }),
});

const companyGetUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).default(10),
    searchBy: z.enum(['companyName', 'name', 'email']).optional(),
    keyword: z.string().optional(),
  }),
});

const companyPatchSchema = z.object({
  params: z.object({
    companyId: z.coerce.number(),
  }),
  body: z.object({
    companyName: z.string().min(1, '회사명은 필수입니다.'),
    companyCode: z.string().min(1, '회사코드는 필수입니다.'),
  }),
});

const companyDeleteSchema = z.object({
  params: z.object({
    companyId: z.coerce.number(),
  }),
});

class CompanySchema {
  companyRegister(req: Request, res: Response, next: NextFunction) {
    const result = companyRegisterSchema.safeParse({ body: req.body });
    return result.success
      ? next()
      : next(createError(400, '잘못된 입력값입니다.'));
  }

  companyGet(req: Request, res: Response, next: NextFunction) {
    const result = companyGetSchema.safeParse({ query: req.query });
    return result.success
      ? next()
      : next(createError(400, '잘못된 입력값입니다.'));
  }

  companyGetUsers(req: Request, res: Response, next: NextFunction) {
    const result = companyGetUsersSchema.safeParse({ query: req.query });
    return result.success
      ? next()
      : next(createError(400, '잘못된 입력값입니다.'));
  }

  companyPatch(req: Request, res: Response, next: NextFunction) {
    const result = companyPatchSchema.safeParse({
      params: req.params,
      body: req.body,
    });
    return result.success
      ? next()
      : next(createError(400, '잘못된 입력값입니다.'));
  }

  companyDeleteParam(req: Request, res: Response, next: NextFunction) {
    const result = companyDeleteSchema.safeParse({ params: req.params });
    return result.success
      ? next()
      : next(createError(400, '잘못된 입력값입니다.'));
  }
}

export const companySchema = new CompanySchema();
