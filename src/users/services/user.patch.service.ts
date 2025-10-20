import bcrypt from 'bcrypt';
import createError from 'http-errors';
import { Prisma } from '@prisma/client';
import { userRepository } from '../repositories/user.repository.js';

type UserPatchFields = Partial<
  Pick<
    Prisma.UsersUncheckedUpdateInput,
    'employeeNumber' | 'phoneNumber' | 'imageUrl' | 'password'
  >
>;

export const userPatchService = {
  async patchMe(
    userId: number,
    body: {
      employeeNumber?: string | undefined;
      phoneNumber?: string | undefined;
      imageUrl?: string | undefined;
      currentPassword: string;
      password?: string | undefined;
      passwordConfirmation?: string | undefined;
    },
  ) {
    // 유저 조회
    const user = await userRepository.findById(userId);
    if (!user) throw createError(404, '존재하지 않는 유저입니다.');

    // 현재 비밀번호 검증 (항상 요구)
    const ok = await bcrypt.compare(body.currentPassword, user.password);
    if (!ok) throw createError(400, '현재 비밀번호가 맞지 않습니다.');

    // 업데이트 데이터 구성
    let hashedPassword: string | undefined;
    if (body.password) {
      if (body.password !== body.passwordConfirmation) {
        throw createError(400, '비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      }
      hashedPassword = await bcrypt.hash(body.password, 10);
    }

    const dataToUpdate = {
      ...(body.employeeNumber ? { employeeNumber: body.employeeNumber } : {}),
      ...(body.phoneNumber ? { phoneNumber: body.phoneNumber } : {}),
      ...(typeof body.imageUrl !== 'undefined'
        ? { imageUrl: body.imageUrl }
        : {}),
      ...(hashedPassword ? { password: hashedPassword } : {}),
    } satisfies UserPatchFields;

    const updated = await userRepository.updateById(user.id, dataToUpdate);
    const { password: _pw, ...safeUser } = updated;
    void _pw;
    return safeUser;
  },
};
