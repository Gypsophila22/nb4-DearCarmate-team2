import type { Request, Response, NextFunction } from 'express';
import { authLoginService } from '../services/auth.login.service.js';
import createError from 'http-errors';
import { tokenService } from '../services/token.service.js';

class AuthController {
  async authLoginController(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authLoginService.login(email, password);
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  }

  async authRefreshController(req: Request, res: Response, next: NextFunction) {
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
}

export const authController = new AuthController();
