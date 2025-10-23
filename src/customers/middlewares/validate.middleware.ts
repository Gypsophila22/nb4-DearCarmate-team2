import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { ZodType, ZodError, z } from 'zod';

interface ValidatedRequest<T> extends Request {
  validated?: T;
}

export const validate = (schema: ZodType) => (
  req: ValidatedRequest<z.infer<typeof schema>>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsed = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((err) => err.message).join(', ');
      return next(createError(400, `Validation Error: ${errorMessages}`));
    }

    req.validated = parsed.data;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.issues.map((err) => err.message).join(', ');
      return next(createError(400, `Validation Error: ${errorMessages}`));
    }
    next(error);
  }
};
