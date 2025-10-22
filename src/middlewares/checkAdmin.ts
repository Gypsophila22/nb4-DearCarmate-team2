import type { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';

/**
 * 관리자 권한 확인 미들웨어
 * req.user.isAdmin === true 인 사용자만 통과
 */
export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.isAdmin) {
    return next(createHttpError(401, '관리자 권한이 필요합니다.'));
  }
  next();
};
