import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { ZodType, ZodError } from 'zod';

// Extend the Request type to include the 'validated' property
declare global {
  namespace Express {
    interface Request {
      validated?: {
        body?: any;
        query?: any;
        params?: any;
      };
    }
  }
}

export const validate = (schema: ZodType) => (
  req: Request,
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
      const errorMessages = parsed.error.errors.map((err) => err.message).join(', ');
      return next(createError(400, `Validation Error: ${errorMessages}`));
    }

    req.validated = parsed.data;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.errors.map((err) => err.message).join(', ');
      return next(createError(400, `Validation Error: ${errorMessages}`));
    }
    next(error);
  }
};
