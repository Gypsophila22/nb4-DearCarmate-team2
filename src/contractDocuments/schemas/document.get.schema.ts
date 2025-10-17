import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { z } from 'zod';

// 쿼리스트링 검증 전용 스키마\
const getDocumentsQuerySchema = z
  .object({
    page: z
      .union([z.string(), z.number()])
      .optional()
      .refine(
        (v) =>
          v === undefined ||
          (Number.isFinite(+v) && Number.isInteger(+v) && +v >= 1),
        'page는 1 이상의 정수여야 합니다.'
      ),
    pageSize: z
      .union([z.string(), z.number()])
      .optional()
      .refine(
        (v) =>
          v === undefined ||
          (Number.isFinite(+v) && Number.isInteger(+v) && +v >= 1 && +v <= 100),
        'pageSize는 1~100 사이의 정수여야 합니다.'
      ),
    searchBy: z.enum(['contractName']).optional(),
    keyword: z.string().optional(),
  })
  .strict();

export function validateGetDocuments(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const result = getDocumentsQuerySchema.safeParse(req.query);
  if (!result.success) {
    return next(createError(400, '잘못된 요청입니다'));
  }
  return next();
}
