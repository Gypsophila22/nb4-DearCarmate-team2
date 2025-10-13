import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { userGetService } from '../services/user.get.service.js';

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw createError(401, '로그인이 필요합니다.');
    const user = await userGetService.getMe(req.user.id);
    return res.json(user);
  } catch (e) {
    return next(e);
  }
}
