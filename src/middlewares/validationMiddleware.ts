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
      let paramsSchema: z.ZodTypeAny | undefined;
      let bodySchema: z.ZodTypeAny | undefined;
      // schemas가 객체 형태인지 아니면 단일 body 스키마인지 체크
      if ('params' in schemas || 'body' in schemas) {
        paramsSchema = (schemas as any).params;
        bodySchema = (schemas as any).body;
      } else {
        bodySchema = schemas as z.ZodTypeAny;
      }

      // params 검증
      if (paramsSchema) {
        // zod 스키마를 이용해 req.params 검증
        const parsed = paramsSchema.safeParse(req.params);

        // 검증 실패 시 zod 결과를 json으로 콘솔 출력
        if (!parsed.success) {
          console.error(
            'Params validation failed:\n',
            JSON.stringify(parsed.error.format(), null, 2),
          );
          return res.status(400).json({ message: '잘못된 요청입니다' });
        }
        // 검증 통과 시 req.paramsDto에 저장
        (req as any).paramsDto = parsed.data;
      }

      // body 검증
      if (bodySchema) {
        // req.body와 Key가 있을때만 검증
        if (!req.body || Object.keys(req.body).length === 0) {
        } else {
          // zod 스키마를 이용해 req.body 검증
          const parsed = bodySchema.safeParse(req.body);
          // 검증 실패 시 zod 결과를 json으로 콘솔 출력
          if (!parsed.success) {
            console.error(
              'Body validation failed:\n',
              JSON.stringify(parsed.error.format(), null, 2),
            );
            return res.status(400).json({ message: '잘못된 요청입니다' });
          }
          // 검증 통과 시 req.bodyDto에 저장
          (req as any).bodyDto = parsed.data;
        }
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
