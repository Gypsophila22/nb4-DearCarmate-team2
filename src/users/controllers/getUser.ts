import prisma from '../../lib/prisma.js';
import type { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';

class GetUser {
  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(createError(401, '로그인이 필요합니다.'));
      }

      const user = await prisma.users.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          employeeNumber: true,
          phoneNumber: true,
          imgUrl: true,
          isAdmin: true,
          company: { select: { companyCode : true } },
        },
      });

      if (!user) {
        return next(createError(404, '존재하지 않는 유저입니다.'));
      }

      return res.json(user);
    } catch (e) {
      console.error(e);
      return next(createError(400, '잘못된 요청입니다.'));
    }
  }
}

export default new GetUser();
