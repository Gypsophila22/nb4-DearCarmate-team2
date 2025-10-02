import { PrismaClient } from '../../../generated/prisma/index.js';
import type { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import { nextTick } from 'process';
import { ru } from 'zod/locales';

const prisma = new PrismaClient();

class DeleteUser {
  async deleteMe(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      return next(createError(401, '로그인이 필요합니다.'));
    }

    await prisma.users.delete({
      where: { id: req.user.id },
    });

    return res.json({ message: '유저 삭제 성공.' });
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    if (!req.user?.isAdmin) {
      return next(createError(403, '관리자 권한이 필요합니다.'));
    }

    const userId = Number(req.params.id);
    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) {
      return next(createError(404, '존재하지 않는 유저입니다.'));
    }

    await prisma.users.delete({ where: { id: userId } });

    return res.json({ message: '유저 삭제 성공.' });
  }
}

export default new DeleteUser();
