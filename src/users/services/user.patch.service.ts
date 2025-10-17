
import bcrypt from 'bcrypt';
import createError from 'http-errors';
import { userPatchRepository } from '../repositories/user.patch.repository.js';

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
    }
  ) {
    // 유저 조회
    const user = await userPatchRepository.findById(userId);
    if (!user) throw createError(404, '존재하지 않는 유저입니다.');

    // 현재 비밀번호 검증 (항상 요구)
    const ok = await bcrypt.compare(body.currentPassword, user.password);
    if (!ok) throw createError(400, '현재 비밀번호가 맞지 않습니다.');

    // 업데이트 데이터 구성
    const dataToUpdate: Record<string, any> = {};
    if (body.employeeNumber) dataToUpdate.employeeNumber = body.employeeNumber;
    if (body.phoneNumber) dataToUpdate.phoneNumber = body.phoneNumber;
    if (typeof body.imageUrl !== 'undefined')
      dataToUpdate.imageUrl = body.imageUrl;

    if (body.password) {
      // (스키마에서 이미 확인했지만 이중 방어)
      if (body.password !== body.passwordConfirmation) {
        throw createError(400, '비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      }
      dataToUpdate.password = await bcrypt.hash(body.password, 10);
    }

    const updated = await userPatchRepository.updateById(user.id, dataToUpdate);
    const { password: _pw, ...safeUser } = updated;
    return safeUser;
  },
};
