import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { z } from 'zod';

const getContractDocumentDownloadSchema = z.object({
  contractDocumentId: z.string().regex(/^\d+$/, '문서 ID는 숫자여야 합니다.'),
});

const getContractDocumentQuerySchema = z
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

class ContractDocumentSchema {
  getContractDocumentDownload(
    req: Request,
    _res: Response,
    next: NextFunction
  ) {
    const result = getContractDocumentDownloadSchema.safeParse(req.params);
    if (!result.success) {
      return next(createError(400, '잘못된 다운로드 요청입니다'));
    }
    return next();
  }

  getContractDocument(req: Request, _res: Response, next: NextFunction) {
    const result = getContractDocumentQuerySchema.safeParse(req.query);
    if (!result.success) {
      return next(createError(400, '잘못된 요청입니다'));
    }
    return next();
  }
}

export const contractDocumentSchema = new ContractDocumentSchema();
