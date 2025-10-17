import prisma from '../../config/prisma.js';
import type { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import createError from 'http-errors';

class PostRegister {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        name,
        email,
        employeeNumber,
        phoneNumber,
        password,
        passwordConfirmation,
        company,
        companyCode,
      } = req.body;

      // 이메일 중복 체크
      const exist = await prisma.users.findUnique({
        where: { email },
      });

      if (exist) {
        return next(createError(409, '이미 존재하는 이메일입니다.'));
      }

      // 비밀번호 확인 체크
      if (password !== passwordConfirmation) {
        return next(
          createError(400, '비밀번호와 비밀번호 확인이 일치하지 않습니다.')
        );
      }

      // 해쉬화
      const hashedPassword = await bcrypt.hash(password, 10);

      // 회사 인증코드 체크
      let companyRecord = await prisma.companies.findUnique({
        where: { companyCode: companyCode },
      });

      if (!companyRecord) {
        return next(createError(404, '존재하지 않는 회사 코드입니다.'));
      }

      const user = await prisma.users.create({
        data: {
          name,
          email,
          employeeNumber,
          phoneNumber,
          password: hashedPassword,
          company: { connect: { companyCode: companyCode } },
        },
        include: {
          company: { select: { companyName: true, companyCode: true } },
        },
      });

      // 응답 (비밀번호 제외)
      const { password: _, ...safeUser } = user;
      res.status(201).json(safeUser);
    } catch (e) {
      console.error(e);
      return next(createError(500, '서버 에러.'));
    }
  }
}

export default new PostRegister();
