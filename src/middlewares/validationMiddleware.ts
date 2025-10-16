import { z } from 'zod';

import type { NextFunction, Request, Response } from 'express';

/**
 * Zod 스키마 기반 요청 검증 미들웨어
 * @param schema - 검증할 Zod 객체 스키마
 * @param source - 검증할 위치 ('body' | 'params' | 'query')
 */

export function validationMiddleware(
  schema: z.ZodObject<any, any>,
  source: 'body' | 'params' | 'query' = 'body',
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req[source]);
      req.dto = data; // 검증된 데이터 저장
      next();
    } catch (err) {
      return res.status(400).json({
        message: '잘못된 요청입니다',
      });
    }
  };
}
