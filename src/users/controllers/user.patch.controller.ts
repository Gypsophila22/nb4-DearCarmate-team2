import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { userPatchService } from '../services/user.patch.service.js';
<<<<<<< HEAD
=======
import type { UserPatchBody } from '../schemas/user.patch.schema.js';
>>>>>>> 5994e76 (feat: user, auth 레이어드 아키텍처 적용, 이미지 등록, 이메일 전송 (#28))

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
>>>>>>> 5994e76 (feat: user, auth 레이어드 아키텍처 적용, 이미지 등록, 이메일 전송 (#28))
    return res.json(safeUser);
  } catch (err) {
    next(err);
  }
}
