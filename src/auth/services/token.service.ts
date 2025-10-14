import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { TOKEN } from '../config/token.js';

type JwtPayload = { id: number; tokenVersion?: number };

class TokenService {
  signAccessToken(payload: JwtPayload) {
    return jwt.sign(payload, TOKEN.access.secret, {
      expiresIn: TOKEN.access.expiresIn,
    });
  }

  signRefreshToken(payload: JwtPayload) {
    return jwt.sign(payload, TOKEN.refresh.secret, {
      expiresIn: TOKEN.refresh.expiresIn,
    });
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, TOKEN.access.secret) as JwtPayload;
    } catch {
      throw createError(401, '유효하지 않은 액세스 토큰');
    }
  }

  verifyRefreshToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, TOKEN.refresh.secret) as JwtPayload;
    } catch {
      throw createError(401, '유효하지 않은 리프레시 토큰');
    }
  }

  async rotateRefreshToken(oldToken: string) {
    const decoded = this.verifyRefreshToken(oldToken);
    const accessToken = this.signAccessToken({
      id: decoded.id /*, tokenVersion: user.tokenVersion*/,
    });
    const refreshToken = this.signRefreshToken({
      id: decoded.id /*, tokenVersion: user.tokenVersion*/,
    });

    return { accessToken, refreshToken };
  }
}

export const tokenService = new TokenService();
