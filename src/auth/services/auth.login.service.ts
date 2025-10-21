import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { authRepository } from '../repositories/auth.repository.js';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'dev_access_secret';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'dev_refresh_secret';

export const authLoginService = {
  async login(email: string, password: string) {
    // 1. 사용자 조회
    const user = await authRepository.userLoginRepository.findByEmail(email);
    if (!user) throw createError(404, '존재하지 않는 사용자입니다.');

    // 2. 비밀번호 검증
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw createError(401, '비밀번호가 올바르지 않습니다.');

    // 3. 토큰 발급
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      ACCESS_SECRET,
      { expiresIn: '1h' },
    );
    const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, {
      expiresIn: '7d',
    });

    // 4. 응답용 데이터 가공
    const { password: _pw, ...userWithoutPw } = user;
    void _pw;
    return { user: userWithoutPw, accessToken, refreshToken };
  },
};
