import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { userPatchService } from '../services/user.patch.service.js';
<<<<<<< HEAD
=======
import type { UserPatchBody } from '../schemas/user.patch.schema.js';
>>>>>>> develop

export async function patchUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) throw createError(401, '로그인이 필요합니다.');

<<<<<<< HEAD
    const safeUser = await userPatchService.patchMe(req.user.id, req.body);
=======
    const { body } = (req as any).validated as { body: UserPatchBody };

    const safeUser = await userPatchService.patchMe(req.user.id, body);
>>>>>>> develop
    return res.json(safeUser);
  } catch (err) {
    next(err);
  }
}
