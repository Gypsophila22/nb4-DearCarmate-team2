import type { Request, Response } from 'express';
import { PrismaClient } from '../../../generated/prisma/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'dev_access_secret';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'dev_refresh_secret';

class PostLogin {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // 요청 유효성 검사
      if (!email || !password) {
        return res.status(400).json({ message: '잘못된 요청입니다' });
      }

      // 유저 조회
      const user = await prisma.users.findUnique({
        where: { email },
        include: {
          company: { select: { code: true } },
        },
      });

      if (!user) {
        return res.status(400).json({ message: '잘못된 요청입니다' });
      }

      // 비밀번호 검증
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ message: '잘못된 요청입니다' });
      }

      // 토큰 발급
      const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        ACCESS_SECRET,
        { expiresIn: '1h' }
      );

      const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, {
        expiresIn: '7d',
      });

      // 응답 (비밀번호 제외)
      const { password: _, ...userWithoutPw } = user;

      return res.json({
        user: userWithoutPw,
        accessToken,
        refreshToken,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: '서버 에러' });
    }
  }
}

export default new PostLogin();
