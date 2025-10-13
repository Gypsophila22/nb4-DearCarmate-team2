import type { NextFunction, Request, Response } from "express";
import { PrismaClient } from "../../../generated/prisma/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createError from "http-errors";

const prisma = new PrismaClient();

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "dev_access_secret";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "dev_refresh_secret";

class PostLogin {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      //유효성 검사도 별도의 파일로 분리하신 후, 라우트에 전처리 미들웨어로 등록하셔서 분리해주세요
      // 요청 유효성 검사
      if (!email || !password) {
        return next(createError(400, "이메일과 비밀번호를 입력해야 합니다."));
      }

      //primsa 관련 코드를 레포지토리를 따로 파셔서 옮겨주세요
      // 유저 조회
      const user = await prisma.users.findUnique({
        where: { email },
        include: {
          company: { select: { code: true } },
        },
      });

      if (!user) {
        return next(createError(404, "존재하지 않는 사용자입니다."));
      }

      //비밀번호 검증과 토큰 발급도 service로 따로 분리하셔서 결과값만 받아주세요
      // 비밀번호 검증
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return next(createError(401, "비밀번호가 올바르지 않습니다."));
      }

      // 토큰 발급
      const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        ACCESS_SECRET,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, {
        expiresIn: "7d",
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
      return next(createError(500, "서버 에러."));
    }
  }
}

export default new PostLogin();
