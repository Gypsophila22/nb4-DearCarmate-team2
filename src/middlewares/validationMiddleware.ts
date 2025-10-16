import { z } from 'zod';

import type { NextFunction, Request, Response } from 'express';

/**
 * Zod 스키마 기반 요청 검증 미들웨어
 */

export function validationMiddleware<
  P extends z.ZodTypeAny = never,
  B extends z.ZodTypeAny = never,
>(schemas: { params?: P; body?: B } | P | B) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // schemas가 객체로 params/body 있는지 체크
      let paramsSchema: z.ZodTypeAny | undefined;
      let bodySchema: z.ZodTypeAny | undefined;

      if ('params' in schemas || 'body' in schemas) {
        paramsSchema = (schemas as any).params;
        bodySchema = (schemas as any).body;
      } else {
        bodySchema = schemas as z.ZodTypeAny;
      }

      // params 검증
      if (paramsSchema) {
        const parsed = paramsSchema.safeParse(req.params);
        if (!parsed.success) {
          // console.error('Params validation failed:', parsed.error.format());
          return res.status(400).json({ message: '잘못된 요청입니다' });
        }
        (req as any).paramsDto = parsed.data;
      }

      // body 검증
      if (bodySchema) {
        if (!req.body || Object.keys(req.body).length === 0) {
        } else {
          const parsed = bodySchema.safeParse(req.body);
          if (!parsed.success) {
            // console.error('Body validation failed:', parsed.error.format());
            return res.status(400).json({ message: '잘못된 요청입니다' });
          }
          (req as any).bodyDto = parsed.data;
        }
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
