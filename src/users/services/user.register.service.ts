import bcrypt from 'bcrypt';
import createError from 'http-errors';

import { userRegisterRepository } from '../repositories/user.register.repository.js';

export const userRegisterService = {
  async register(input: {
    name: string;
    email: string;
    employeeNumber: string;
    phoneNumber: string;
    password: string;
    companyName: string;
    companyCode: string;
  }) {
    // 이메일 중복
    const exist = await userRegisterRepository.findByEmail(input.email);
    if (exist) throw createError(409, '이미 존재하는 이메일입니다.');

    // 회사 코드 검증
    const company = await userRegisterRepository.findByCode(input.companyCode);
    if (!company) throw createError(404, '존재하지 않는 회사 코드입니다.');

    // 패스워드 해시
    const hashed = await bcrypt.hash(input.password, 10);

    // 사용자 생성
    try {
      const created = await userRegisterRepository.createUser({
        name: input.name,
        email: input.email,
        employeeNumber: input.employeeNumber,
        phoneNumber: input.phoneNumber,
        password: hashed,
        companyCode: input.companyCode,
      });
      return created;
    } catch (e: any) {
      // Prisma 고유 제약 조건 에러 매핑(P2002)
      if (e?.code === 'P2002') {
        throw createError(409, '이미 존재하는 이메일입니다.');
      }
      throw e;
    }
  },
};
