import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      res
        .status(400)
        .json({ message: error.errors?.[0]?.message ?? '잘못된 요청입니다' });
    }
  };
