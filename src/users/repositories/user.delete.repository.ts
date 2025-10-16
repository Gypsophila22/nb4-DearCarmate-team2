import prisma from '../../lib/prisma.js';

export const userDeleteRepository = {
  findById(id: number) {
    return prisma.users.findUnique({ where: { id } });
  },

  // 로깅용
  findByEmail(email: string) {
    return prisma.users.findUnique({ where: { email } });
  },

  async deleteById(id: number) {
    return prisma.users.delete({ where: { id } });
  },
};
