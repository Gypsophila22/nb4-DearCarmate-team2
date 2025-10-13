import createError from 'http-errors';
import { userDeleteRepository } from '../repositories/user.delete.repository.js';

export const userDeleteService = {
  /** 본인 삭제 */
  // async deleteMe(userId: number) {
  //   const user = await userDeleteRepository.findById(userId);
  //   if (!user) throw createError(404, '존재하지 않는 유저입니다.');

  //   try {
  //     await userDeleteRepository.deleteById(user.id);
  //   } catch (e: any) {
  //     if (e?.code === 'P2003') {
  //       // FK 제약 등으로 삭제 불가
  //       throw createError(409, '관련된 데이터가 있어 삭제할 수 없습니다.');
  //     }
  //     throw e;
  //   }
  //   return { message: '유저 삭제 성공.' };
  // },
  async deleteMe(userId: number) {
    const before = await userDeleteRepository.findById(userId);
    console.log(
      '[DELETE] before exists:',
      !!before,
      'id:',
      userId,
      'email:',
      before?.email
    );

    if (!before) throw createError(404, '존재하지 않는 유저입니다.');

    try {
      const deleted = await userDeleteRepository.deleteById(before.id);
      console.log('[DELETE] deleted row:', {
        id: deleted.id,
        email: deleted.email,
      });

      // ID로 재조회 (하드 삭제면 null)
      const afterById = await userDeleteRepository.findById(before.id);
      console.log('[DELETE] after by id is null?:', afterById === null);

      // 이메일로 재조회 (하드 삭제면 null, 소프트/다른 DB면 true일 수도)
      const afterByEmail = await userDeleteRepository.findByEmail(
        deleted.email
      );
      console.log('[DELETE] after by email is null?:', afterByEmail === null);
    } catch (e: any) {
      if (e?.code === 'P2003') {
        throw createError(409, '관련된 데이터가 있어 삭제할 수 없습니다.');
      }
      throw e;
    }

    return { message: '유저 삭제 성공.' };
  },

  /** 관리자에 의한 타 사용자 삭제 */
  async deleteByAdmin(targetUserId: number) {
    const user = await userDeleteRepository.findById(targetUserId);
    if (!user) throw createError(404, '존재하지 않는 유저입니다.');

    try {
      await userDeleteRepository.deleteById(targetUserId);
    } catch (e: any) {
      if (e?.code === 'P2003') {
        throw createError(409, '관련된 데이터가 있어 삭제할 수 없습니다.');
      }
      throw e;
    }
    return { message: '유저 삭제 성공.' };
  },
};
