import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { z } from 'zod';

const bodySchema = z.object({
  addDocumentIds: z.array(z.number().int().positive()).optional().default([]),
  removeDocumentIds: z
    .array(z.number().int().positive())
    .optional()
    .default([]),
  rename: z
    .array(
      z.object({
        id: z.number().int().positive(),
        fileName: z.string().min(1),
      })
    )
    .optional()
    .default([]),
});

export function validatePatchContractDocuments(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const result = bodySchema.safeParse(req.body);
  if (!result.success) return next(createError(400, '잘못된 입력값입니다.'));
  return next();
}
