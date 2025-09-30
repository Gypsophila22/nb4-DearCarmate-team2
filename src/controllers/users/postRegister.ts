import { PrismaClient } from '../../../generated/prisma/index.js';
import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

class PostRegister {
  async register(req: Request, res: Response) {
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

      // 존재하는 이메일 체크
      const exist = await prisma.users.findUnique({
        where: { email },
      });

      if (exist) {
        return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
      }

      // 비밀번호 확인 체크
      if (password !== passwordConfirmation) {
        return res
          .status(400)
          .json({ message: '비밀번호와 비밀번호 확인이 일치하지 않습니다.' });
      }

      // 해쉬화
      const hashedPassword = await bcrypt.hash(password, 10);

      // 회사 인증코드 체크
      let companyRecord = await prisma.companies.findUnique({
        where: { code: companyCode },
      });

      if (!companyRecord) {
        return res
          .status(404)
          .json({ message: '존재하지 않는 회사 코드입니다.' });
      }

      const user = await prisma.users.create({
        data: {
          name,
          email,
          employeeNumber,
          phoneNumber,
          password: hashedPassword,
          company: { connect: { code: companyCode } },
        },
        include: {
          company: { select: { name: true, code: true } },
        },
      });

      res.status(201).json(user);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: '서버 에러.' });
    }
  }
}

export default new PostRegister();
