import type { ZodObject } from 'zod';
import { ZodError } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

export const validate =
  (schema: ZodObject) => (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      (req as any).validated = parsed;
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        const msg = e.issues[0]?.message ?? '요청이 올바르지 않습니다.';
        return next(createError(400, msg));
      }
      next(e);
    }
  };
