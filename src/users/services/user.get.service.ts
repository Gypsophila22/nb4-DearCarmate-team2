import createError from 'http-errors';

import { userRepository } from '../repositories/user.repository.js';

export const userGetService = {
  async getMe(id: number) {
    const user = await userRepository.findSelectedById(id);
    if (!user) throw createError(404, '존재하지 않는 유저입니다.');
    return user;
  },
};
