import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { tokenService } from '../services/token.service.js';

async function postRefresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return next(createError(400, '리프레시 토큰이 필요합니다.'));

    const { accessToken, refreshToken: newRefreshToken } =
      await tokenService.rotateRefreshToken(refreshToken);

    return res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    return next(err);
  }
}

export default postRefresh;
