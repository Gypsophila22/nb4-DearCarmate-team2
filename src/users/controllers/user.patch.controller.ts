import createError from 'http-errors';

import { userPatchService } from '../services/user.patch.service.js';

import type { Request, Response, NextFunction } from 'express';

export async function patchUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw createError(401, '로그인이 필요합니다.');

    const safeUser = await userPatchService.patchMe(req.user.id, req.body);
    return res.json(safeUser);
  } catch (err) {
    next(err);
  }
}
