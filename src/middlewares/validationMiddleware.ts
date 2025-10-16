import { z } from 'zod';

import type { NextFunction, Request, Response } from 'express';

/**
 * Zod 스키마 기반 요청 검증 미들웨어
 * @param schema - 검증할 Zod 객체 스키마
 * @param source - 검증할 위치 ('body' | 'params' | 'query')
 */

export function validationMiddleware<
  P extends z.ZodTypeAny,
  B extends z.ZodTypeAny,
>(schemas: { params?: P; body?: B }) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (schemas.params) {
      const parsedParams = schemas.params.safeParse(req.params);
      if (!parsedParams.success)
        return res.status(400).json({ message: '잘못된 요청입니다' });
      (req as any).paramsDto = parsedParams.data as z.infer<P>;
    }

    if (schemas.body) {
      const parsedBody = schemas.body.safeParse(req.body);
      if (!parsedBody.success)
        return res.status(400).json({ message: '잘못된 요청입니다' });
      (req as any).bodyDto = parsedBody.data as z.infer<B>;
    }

    next();
  };
}
