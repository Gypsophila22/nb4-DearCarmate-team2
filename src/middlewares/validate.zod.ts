import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const validate =
  (schema: import('zod').ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      req.validated = parsed;
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        const issues = e.issues.map((i) => {
          // 공통 필드
          const out: Record<string, unknown> = {
            path: i.path.join('.'),
            code: i.code,
            message: i.message,
          };

          // 버전에 따라 있을 수도/없을 수도 있는 필드들은 "안전 접근"
          const src = i as unknown as Record<string, unknown>;
          for (const k of [
            'expected',
            'received',
            'minimum',
            'maximum',
            'inclusive',
            'exact',
            'options',
            'validation', // 일부 버전/케이스에서만 존재
          ]) {
            if (k in src) out[k] = src[k];
          }

          return out;
        });

        return res.status(400).json({ message: '검증 오류', issues });
      }
      next(e);
    }
  };
