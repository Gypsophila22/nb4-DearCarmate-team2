import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { z } from 'zod';

const validateDownloadschema = z.object({
  contractDocumentId: z.string().regex(/^\d+$/, '문서 ID는 숫자여야 합니다.'),
});

export function validateDownload(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const result = validateDownloadschema.safeParse(req.params);
  if (!result.success) {
    return next(createError(400, '잘못된 요청입니다(다운로드)'));
  }
  return next();
}
