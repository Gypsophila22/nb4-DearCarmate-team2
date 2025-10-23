// src/middlewares/validateSchema.ts
import type { Request, Response, NextFunction } from 'express';
import type { ZodObject } from 'zod';
import createHttpError from 'http-errors';

/**
 * @desc 주어진 Zod 스키마를 기반으로 body/query/params 검증을 수행
 * @usage router.post('/', validateSchema(schema), controller)
 */
export function validateSchema(schema: ZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch {
      next(createHttpError(400, '잘못된 요청입니다.'));
    }
  };
}
