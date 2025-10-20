import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { userDeleteService } from '../services/user.delete.service.js';

export async function deleteMe(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw createError(401, '로그인이 필요합니다.');
    const result = await userDeleteService.deleteMe(req.user.id);
    return res.json(result);
  } catch (e) {
    next(e);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user!.isAdmin) throw createError(403, '관리자 권한이 필요합니다.');
    const id = Number(req.params.id);
    const result = await userDeleteService.deleteByAdmin(id);
    return res.json(result);
  } catch (e) {
    next(e);
  }
}
