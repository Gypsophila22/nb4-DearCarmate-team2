import prisma from '../../lib/prisma.js';

export const userRepository = {
  async findByEmail(email: string) {
    return prisma.users.findUnique({
      where: { email },
      include: { company: { select: { code: true } } },
    });
  },
};
