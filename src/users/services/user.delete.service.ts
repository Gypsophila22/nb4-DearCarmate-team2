import createError from 'http-errors';

import { Prisma } from '@prisma/client';

import { userRepository } from '../repositories/user.repository.js';

function mapPrismaDeleteError(e: unknown) {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === 'P2003') {
      // FK 제약 등으로 삭제 불가
      throw createError(409, '관련된 데이터가 있어 삭제할 수 없습니다.');
    }
  }
  throw e;
}

export const userDeleteService = {
  /** 본인 삭제 */
  async deleteMe(userId: number) {
    const user = await userRepository.findById(userId);
    if (!user) throw createError(404, '존재하지 않는 유저입니다.');

    try {
      await userRepository.deleteById(user.id);
    } catch (e: unknown) {
      mapPrismaDeleteError(e);
    }
    return { message: '유저 삭제 성공.' };
  },

  /** 관리자에 의한 타 사용자 삭제 */
  async deleteByAdmin(targetUserId: number) {
    const user = await userRepository.findById(targetUserId);
    if (!user) throw createError(404, '존재하지 않는 유저입니다.');

    try {
      const { count } = await userRepository.deleteNonAdminById(targetUserId);
      if (count === 0) throw createError(403, '어드민은 삭제할 수 없습니다.');
    } catch (e: unknown) {
      mapPrismaDeleteError(e);
    }
    return { message: '유저 삭제 성공.' };
  },
};
