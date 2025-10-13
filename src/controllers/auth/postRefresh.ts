import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;

class PostRefresh {
  async refresh(req: Request, res: Response, next: NextFunction) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(createError(400, '잘못된 요청입니다.'));
    }

    try {
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as {
        id: number;
      };

      const accessToken = jwt.sign({ id: decoded.id }, ACCESS_SECRET, {
        expiresIn: '1h',
      });
      const newRefreshToken = jwt.sign({ id: decoded.id }, REFRESH_SECRET, {
        expiresIn: '7d',
      });

      return res.json({ accessToken, refreshToken: newRefreshToken });
    } catch (err) {
      return next(createError(401, '유효하지 않은 토큰.'));
    }
  }
}

export default new PostRefresh();
