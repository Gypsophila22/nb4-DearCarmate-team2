import createError from 'http-errors';
import { userGetRepository } from '../repositories/user.get.repository.js';

export const userGetService = {
  async getMe(id: number) {
    const user = await userGetRepository.findSelectedById(id);
    if (!user) throw createError(404, '존재하지 않는 유저입니다.');
    return user;
  },
};
